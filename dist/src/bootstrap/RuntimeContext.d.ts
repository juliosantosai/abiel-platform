declare class RuntimeContext {
    constructor({ runtimeEngine, eventBus, architectureRegistry, moduleRegistry, pluginRegistry, abielCore, expressApp, logger, metrics, health, state, }?: {
        runtimeEngine?: any;
        eventBus?: any;
        architectureRegistry?: any;
        moduleRegistry?: any;
        pluginRegistry?: any;
        abielCore?: any;
        expressApp?: any;
        logger?: any;
        metrics?: any;
        health?: any;
        state?: string;
    });
    get status(): any;
    toJSON(): {
        state: any;
        metrics: any;
        health: any;
        runtimeEngine: {
            type: any;
        };
        eventBus: {
            type: any;
        };
        moduleRegistry: boolean;
        pluginRegistry: boolean;
        architectureRegistry: boolean;
        abielCore: boolean;
        expressApp: boolean;
    };
}
//# sourceMappingURL=RuntimeContext.d.ts.map