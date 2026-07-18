import { ExecutionContext } from "./ExecutionContext";
export interface PluginManifest {
    name: string;
    version: string;
    capabilities?: string[];
    metadata?: Record<string, unknown>;
}
export interface Plugin {
    install?(): Promise<void>;
    execute?(context: ExecutionContext, input?: unknown): Promise<unknown>;
    uninstall?(): Promise<void>;
}
export interface PluginPort {
    manifest: PluginManifest;
    plugin: Plugin;
}
//# sourceMappingURL=PluginPort.d.ts.map