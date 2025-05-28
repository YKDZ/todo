import { PageContext } from "vike/types";
import { initPinia } from "../utils/pinia";

export const onCreatePageContext = (ctx: PageContext) => {
  ctx.pinia = initPinia();
};
