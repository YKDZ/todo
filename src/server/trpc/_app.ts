import { todoRouter } from "./routers/todo";
import { userRouter } from "./routers/user";
import { router } from "./server";

export const appRouter = router({
  user: userRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
