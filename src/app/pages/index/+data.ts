import { useSSCTRPC } from "@/server/trpc/sscClient";
import type { PageContextServer } from "vike/types";

export const data = async (ctx: PageContextServer) => {
  if (!ctx.user) return { todos: [] };

  const todos = await useSSCTRPC(ctx).todo.listOwned();

  return { todos };
};

export type Data = Awaited<ReturnType<typeof data>>;
