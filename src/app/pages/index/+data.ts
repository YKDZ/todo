import { useSSCTRPC } from "@/server/trpc/sscClient";
import { PageContextServer } from "vike/types";

export const data = async ({ user, userId }: PageContextServer) => {
  if (!userId) return { todos: [] };

  const todos = await useSSCTRPC({ user, userId }).todo.listOwned({ userId });

  return { todos };
};

export type Data = Awaited<ReturnType<typeof data>>;
