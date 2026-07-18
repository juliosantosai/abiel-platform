"use strict";
class PluginRegistry {
    constructor({ plugins = [] } = {}) {
        this.plugins = Array.isArray(plugins) ? plugins : [];
    }
    register(pluginPort) {
        if (!pluginPort || !pluginPort.manifest || !pluginPort.manifest.name) {
            throw new Error('PluginRegistry.register requires a PluginPort with manifest.name');
        }
        this.plugins.push({
            manifest: pluginPort.manifest,
            plugin: pluginPort.plugin,
            installed: Boolean(pluginPort.installed ?? true),
        });
        return pluginPort;
    }
    list() {
        return [...this.plugins];
    }
}
module.exports = PluginRegistry;
//# sourceMappingURL=PluginRegistry.js.map