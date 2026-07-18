"use strict";
class RuntimeContext {
    constructor({ runtimeEngine = null, eventBus = null, architectureRegistry = null, moduleRegistry = null, pluginRegistry = null, abielCore = null, expressApp = null, logger = null, metrics = null, health = null, state = 'BOOTING', } = {}) {
        this.runtimeEngine = runtimeEngine;
        this.eventBus = eventBus;
        this.architectureRegistry = architectureRegistry;
        this.moduleRegistry = moduleRegistry;
        this.pluginRegistry = pluginRegistry;
        this.abielCore = abielCore;
        this.expressApp = expressApp;
        this.logger = logger;
        this.metrics = metrics;
        this.health = health;
        this.state = state;
    }
    get status() {
        return this.state;
    }
    toJSON() {
        return {
            state: this.state,
            metrics: this.metrics,
            health: this.health,
            runtimeEngine: this.runtimeEngine ? { type: this.runtimeEngine.constructor?.name } : null,
            eventBus: this.eventBus ? { type: this.eventBus.constructor?.name || 'EventBus' } : null,
            moduleRegistry: Boolean(this.moduleRegistry),
            pluginRegistry: Boolean(this.pluginRegistry),
            architectureRegistry: Boolean(this.architectureRegistry),
            abielCore: Boolean(this.abielCore),
            expressApp: Boolean(this.expressApp),
        };
    }
}
module.exports = RuntimeContext;
//# sourceMappingURL=RuntimeContext.js.map