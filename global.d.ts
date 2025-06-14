import type { User } from "@/shared/schema/prisma";
import type { Pinia, StateTree } from "pinia";
import type { HTTPHelpers } from "./src/server/utils/http-helpers";

declare global {
  namespace Vike {
    interface PageContext {
      user: User | null;
      sessionId: string | null;
      _piniaInitState?: StateTree;
    }
    interface PageContextServer extends HTTPHelpers {
      pinia: Pinia;
      pluginRegistry: PluginRegistry;
      helpers: HTTPHelpers;
    }
    interface GlobalContextClient {
      pinia: Pinia;
    }
  }
}

export {};
