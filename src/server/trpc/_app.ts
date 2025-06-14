import { authRouter } from "./routers/auth";
import { todoRouter } from "./routers/todo";
import { userRouter } from "./routers/user";
import { router } from "./server";

export const appRouter = router({
  user: userRouter,
  todo: todoRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
