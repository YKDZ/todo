import { redirect } from "vike/abort";
import type { PageContextServer } from "vike/types";

export const guard = (ctx: PageContextServer) => {
  if (!ctx.user) throw redirect("/auth");
};
