import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
import Root from "../layouts/Root.vue";
import vikeServer from "vike-server/config";

export default {
  Layout: Root,

  server: "@/server/index.ts",

  passToClient: ["user", "_piniaInitState"],

  filesystemRoutingRoot: "/",

  extends: [vikeVue, vikeServer],
} satisfies Config;
