import type { CatPlugin } from "../plugin-registry";
import { Provider } from "./provider";

class Plugin implements CatPlugin {
  async onLoaded() {}

  getAuthProviders() {
    return [new Provider()];
  }
}

const plugin = new Plugin();

export default plugin;
