import { apply } from "vike-server/hono";
import { serve } from "vike-server/hono/serve";
import app from "./app";
import "dotenv/config";
import { PrismaDB } from "./db/prisma";
import { userFromSessionId } from "./utils/user";
import { createHTTPHelpers } from "./utils/http-helpers";
import { PluginRegistry } from "./plugin/plugin-registry";
import { RedisDB } from "./db/redis";

const initDB = async () => {
  try {
    await PrismaDB.connect();
    await RedisDB.connect();

    console.info("Successfully connect to database.");

    await PrismaDB.ping();
    await RedisDB.ping();

    console.info("All database is health.");
  } catch (e) {
    console.error("Database init failed. Todo process will exit with code 1 now.", e);
    process.exit(1);
  }
};

await (async () => {
  await initDB();
})();

function startServer() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  apply(app, {
    pageContext: async (runtime) => {
      const helpers = createHTTPHelpers(runtime.hono.req.raw, runtime.hono.res.headers);

      const sessionId = helpers.getCookie("sessionId");
      const user = await userFromSessionId(sessionId ?? "");

      return {
        user,
        sessionId,
        pluginRegistry: PluginRegistry.getInstance(),
        ...helpers,
      };
    },
  });

  return serve(app, {
    port,
    onCreate: async (nodeServer) => {},
  });
}

export default startServer();

export const pluginRegistry = new PluginRegistry();
