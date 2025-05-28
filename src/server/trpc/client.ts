import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { AppRouter } from "./_app";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: new URL(`/api/trpc`, import.meta.env.PUBLIC_ENV__URL).toString(),
    }),
  ],
});
