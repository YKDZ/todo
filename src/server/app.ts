import { Hono } from "hono";
import { trpcHandler } from "./handler/trpc";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/api/trpc/*",
  cors({
    origin: import.meta.env.PUBLIC_ENV__URL as string,
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

app.use(
  csrf({
    origin: [new URL(import.meta.env.PUBLIC_ENV__URL as string).hostname, import.meta.env.OIDC_AUTH_URI as string],
  }),
);

app.route("/api/trpc", trpcHandler);

export default app;
