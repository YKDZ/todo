import { PageContext } from "vike/types";
import { initPinia } from "../utils/pinia";

export const onCreateApp = (ctx: PageContext) => {
  const { app } = ctx;

  if (!app) return;

  if (!import.meta.env.SSR) hydratePinia(ctx);

  app.use(ctx.globalContext.pinia ?? ctx.pinia!);
};

const hydratePinia = (ctx: PageContext) => {
  ctx.globalContext.pinia = initPinia();
  const { _piniaInitState } = ctx;
  if (_piniaInitState) ctx.globalContext.pinia.state.value = _piniaInitState;
};
