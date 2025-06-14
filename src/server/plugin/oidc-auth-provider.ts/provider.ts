import { createRemoteJWKSet, jwtVerify } from "jose";
import { randomChars } from "./utils/crypto";
import { createOIDCAuthURL } from "./utils/oidc";
import type { AuthProvider, AuthResult, PreAuthResult } from "../auth-provider";
import type { HTTPHelpers } from "@/server/utils/http-helpers";
import { redis } from "@/server/db/redis";
import { safeJoinURL } from "@/shared/utils/url";

export class Provider implements AuthProvider {
  getId() {
    return process.env.OIDC_ISSUER ?? "";
  }

  getType() {
    return "OIDC";
  }

  getName() {
    return process.env.OIDC_DISPLAY_NAME ?? "My SSO";
  }

  async handlePreAuth(sessionId: string) {
    if (!process.env.OIDC_CLIENT_ID) throw new Error("Config invalid");

    const state = randomChars();
    const nonce = randomChars();

    const redirectURL = await createOIDCAuthURL(state, nonce);

    return {
      sessionId: sessionId,
      passToClient: {
        redirectURL,
      },
      sessionMeta: { state, nonce },
    } satisfies PreAuthResult;
  }

  async handleAuth(
    gotFromClient: {
      urlSearchParams?: unknown;
    },
    { getCookie, delCookie }: HTTPHelpers,
  ) {
    if (
      !gotFromClient ||
      typeof gotFromClient !== "object" ||
      !gotFromClient.urlSearchParams ||
      typeof gotFromClient.urlSearchParams !== "object" ||
      !("state" in gotFromClient.urlSearchParams) ||
      !("code" in gotFromClient.urlSearchParams) ||
      typeof gotFromClient.urlSearchParams.code !== "string" ||
      typeof gotFromClient.urlSearchParams.state !== "string"
    ) {
      throw new Error("Incorrect url search params");
    }

    const { state, code } = gotFromClient.urlSearchParams;

    // 验证 OIDC 会话
    const preAuthSessionId = getCookie("preAuthSessionId");
    if (!preAuthSessionId) throw new Error("OIDC Session not found in cookie");
    const oidcSessionKey = `auth:preAuth:session:${preAuthSessionId}`;
    const { state: storedState, nonce: storedNonce } = await redis.hGetAll(oidcSessionKey);
    await redis.del(oidcSessionKey);

    // 验证 State
    if (!storedState || storedState !== state || !storedNonce) throw new Error("State do not match");
    delCookie("preAuthSessionId");

    // 请求 Token
    const params = new URLSearchParams({
      client_id: process.env.OIDC_CLIENT_ID as string,
      client_secret: process.env.OIDC_CLIENT_SECRET as string,
      code,
      redirect_uri: safeJoinURL(process.env.PUBLIC_ENV__URL as string, "/auth/callback") as string,
      grant_type: "authorization_code",
    });

    const response = await fetch(process.env.OIDC_TOKEN_URI as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange token`);
    }

    const body = await response.json();

    if (body.error) {
      throw new Error(`Failed to exchange token: ${body.error_description}`);
    }

    // 验证 ID Token
    const { id_token: idToken } = body;

    const JWKS = createRemoteJWKSet(new URL(process.env.OIDC_JWKS_URI as string));

    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: process.env.OIDC_ISSUER as string,
      audience: process.env.OIDC_CLIENT_ID as string,
    });

    // 解析 ID Token 携带的信息
    const {
      sub,
      name,
      preferred_username: preferredUserName,
      nickname,
      email,
      email_verified: emailVerified,
      nonce,
    } = payload as {
      sub: string;
      name: string;
      preferred_username: string;
      nickname: string;
      email: string;
      email_verified: boolean;
      nonce: string;
    };

    // 验证 Nonce
    if (nonce !== storedNonce) throw new Error("NONCE do not match");

    // 所有验证完成
    return {
      userName: preferredUserName ?? nickname ?? name,
      providerIssuer: process.env.OIDC_ISSUER as string,
      providedAccountId: sub,
      sessionMeta: {
        idToken,
      },
    } satisfies AuthResult;
  }

  async handleLogout(sessionId: string) {
    const idToken = await redis.hGet(`user:session:${sessionId}`, "idToken");

    if (!idToken) throw new Error("ID Token 不存在");

    const state = randomChars(32);
    const params = new URLSearchParams({
      id_token_hint: idToken,
      post_logout_redirect_uri: process.env.PUBLIC_ENV__URL as string,
      state,
    });

    const res = await fetch(`${process.env.OIDC_LOGOUT_URI}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) throw new Error("登出时出现错误");
  }
}
