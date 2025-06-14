import type { AuthProvider } from "./auth-provider";
import OIDCAuthProvider from "./oidc-auth-provider.ts";

export interface CatPlugin {
  onLoaded: () => Promise<void>;
  getAuthProviders?: () => AuthProvider[];
}

export class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins: Map<string, CatPlugin> = new Map();

  constructor() {
    this.register("oidc_auth_provider", OIDCAuthProvider);
  }

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  public register(id: string, plugin: CatPlugin): void {
    this.plugins.set(id, plugin);
  }

  public getAuthProviders(): AuthProvider[] {
    return Array.from(this.plugins.values())
      .map((plugin) => plugin.getAuthProviders?.())
      .filter((handlers): handlers is AuthProvider[] => handlers !== undefined)
      .flat();
  }
}
