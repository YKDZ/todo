import { randomChars } from "./crypto";
import { redis } from "@/server/db/redis";

export const createOIDCSession = async (state: string, nonce: string) => {
  const sessionId = randomChars();
  const sessionKey = `auth:oidc:session:${sessionId}`;

  await redis.hSet(sessionKey, {
    state,
    nonce,
  });

  await redis.expire(sessionKey, 5 * 60);

  return sessionId;
};

export const createOIDCAuthURL = async (state: string, nonce: string): Promise<string> => {
  const redirecturi = new URL("/auth/callback", process.env.PUBLIC_ENV__URL as string).toString();

  const url = new URL("", process.env.OIDC_AUTH_URI as string);
  url.searchParams.append("client_id", process.env.OIDC_CLIENT_ID ?? "");
  url.searchParams.append("redirect_uri", redirecturi);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", process.env.OIDC_SCOPES ?? "");
  url.searchParams.append("state", state);
  url.searchParams.append("nonce", nonce);

  return url.toString();
};
