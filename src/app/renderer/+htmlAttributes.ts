import type { PageContextServer } from "vike/types";

export default (ctx: PageContextServer) => {
  return { "data-theme": ctx.getCookie("theme") };
};
