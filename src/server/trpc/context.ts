import { userFromSessionId } from "../utils/user";
import { createHTTPHelpers } from "../utils/http-helpers";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { PluginRegistry } from "../plugin/plugin-registry";

export const createHttpContext = async ({
  req,
  resHeaders,
}: Pick<FetchCreateContextFnOptions, "req" | "resHeaders">) => {
  const helpers = createHTTPHelpers(req, resHeaders);

  const sessionId = helpers.getCookie("sessionId") ?? null;

  const user = sessionId ? await userFromSessionId(sessionId) : null;

  return {
    user,
    sessionId,
    pluginRegistry: PluginRegistry.getInstance(),
    ...helpers,
    helpers,
  };
};

export type HttpContext = Awaited<ReturnType<typeof createHttpContext>>;

export const EMPTY_CONTEXT = {
  user: null,
  sessionId: "",
  setCookie: () => {},
  getCookie: () => "",
  getQueryParam: () => "",
  setResHeader: () => {},
  delCookie: () => {},
  getReqHeader: () => "",
};
