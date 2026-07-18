class CoreRuntimeService {
    constructor({ runtimeEngine = null, eventBus = null, abielCore = null, moduleRegistry = null, pluginRegistry = null, runtimeContext = null } = {}) {
        this.runtimeEngine = runtimeEngine;
        this.eventBus = eventBus;
        this.abielCore = abielCore;
        this.moduleRegistry = moduleRegistry;
        this.pluginRegistry = pluginRegistry;
        this.runtimeContext = runtimeContext;
    }

    async getRuntimeStatus() {
        return {
            status: this.runtimeContext?.status || 'RUNNING',
            runtimeEngine: {
                available: Boolean(this.runtimeEngine),
                activeExecutions: this.runtimeEngine?.activeExecutions?.size ?? 0,
            },
            core: {
                available: Boolean(this.abielCore),
                tenantId: this.abielCore?.getTenantContext?.()?.tenantId || null,
            },
        };
    }

    async getModules() {
        if (typeof this.moduleRegistry?.list === 'function') {
            return this.moduleRegistry.list();
        }
        return [];
    }

    async getPlugins() {
        if (typeof this.pluginRegistry?.list === 'function') {
            return this.pluginRegistry.list();
        }
        return [];
    }

    async getEvents() {
        const handlers = this.eventBus?.handlers || this.eventBus?._handlers || {};
        return Object.keys(handlers).map((name) => ({
            name,
            subscribers: Array.isArray(handlers[name]) ? handlers[name].length : 0,
        }));
    }

    async getHealth() {
        return {
            status: this.runtimeEngine && this.eventBus ? 'ok' : 'degraded',
            runtimeEngine: Boolean(this.runtimeEngine),
            eventBus: Boolean(this.eventBus),
            moduleRegistry: Boolean(this.moduleRegistry),
            pluginRegistry: Boolean(this.pluginRegistry),
        };
    }
}

module.exports = CoreRuntimeService;