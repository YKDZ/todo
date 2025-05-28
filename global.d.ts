import { User } from "@/shared/schema/prisma";
import { Pinia, StateTree } from "pinia";
import { PageContextServer } from "vike/types";
import type { HTTPHelpers } from "./src/server/utils/http-helpers";

declare global {
  namespace Vike {
    interface PageContext {
      user: User | null;
      userId: string | null;
      isFirst: boolean;
      pinia?: Pinia;
      _piniaInitState?: StateTree;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface PageContextServer extends HTTPHelpers {}
    interface GlobalContext {
      pinia?: Pinia;
    }
  }
}

export {};
