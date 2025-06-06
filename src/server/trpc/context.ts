import { userFromId } from "../utils/user";
import { createHTTPHelpers } from "../utils/http-helpers";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createHttpContext = async ({
  req,
  resHeaders,
}: Pick<FetchCreateContextFnOptions, "req" | "resHeaders">) => {
  const helpers = createHTTPHelpers(req, resHeaders);

  const userId = helpers.getCookie("userId") ?? null;
  const user = userId ? await userFromId(userId) : null;

  return {
    userId,
    user,
    ...helpers,
  };
};

export type HttpContext = Awaited<ReturnType<typeof createHttpContext>>;

export const EMPTY_CONTEXT = {
  user: null,
  userId: null,
  setCookie: () => {},
  getCookie: () => "",
  getQueryParam: () => "",
  setResHeader: () => {},
  delCookie: () => {},
  getReqHeader: () => "",
};
