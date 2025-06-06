import { apply } from "vike-server/hono";
import { serve } from "vike-server/hono/serve";
import app from "./app";
import "dotenv/config";
import { prisma, PrismaDB } from "./db/prisma";
import { userFromId } from "./utils/user";
import { useSSCTRPC } from "./trpc/sscClient";
import { createHTTPHelpers } from "./utils/http-helpers";

const initDB = async () => {
  try {
    await PrismaDB.connect();

    console.info("Successfully connect to database.");

    await prisma.$queryRaw`SELECT 1`;

    console.info("All database is health.");
  } catch (e) {
    console.error("Database init failed. CAT process will exit with code 1 now.", e);
    process.exit(1);
  }
};

await (async () => {
  await initDB();
})();

const port = import.meta.env.PORT ? parseInt(import.meta.env.PORT) : 3000;

apply(app, {
  pageContext: async (runtime) => {
    const helpers = createHTTPHelpers(runtime.hono.req.raw, runtime.hono.res.headers);

    let userId = helpers.getCookie("userId") ?? null;
    let user = userId ? await userFromId(userId) : null;
    let isFirst = false;

    if (!userId || (userId && !user)) {
      user = await useSSCTRPC({ ...helpers }).user.askNew();
      userId = user.id;
      isFirst = true;
    }

    return {
      user,
      userId,
      isFirst,
      ...helpers,
    };
  },
});
const server = serve(app, {
  port,
});

export default server;
