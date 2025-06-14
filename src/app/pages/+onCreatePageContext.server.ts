import type { PageContextServer } from "vike/types";
import { createPinia } from "pinia";
import { useProfileStore } from "../stores/profile";

export const onCreatePageContext = (ctx: PageContextServer) => {
  ctx.pinia = createPinia();
  useProfileStore(ctx.pinia).initInServer(ctx.getCookie);
};
