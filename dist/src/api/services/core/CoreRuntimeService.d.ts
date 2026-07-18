declare class CoreRuntimeService {
    constructor({ runtimeEngine, eventBus, abielCore, moduleRegistry, pluginRegistry, runtimeContext }?: {
        runtimeEngine?: any;
        eventBus?: any;
        abielCore?: any;
        moduleRegistry?: any;
        pluginRegistry?: any;
        runtimeContext?: any;
    });
    getRuntimeStatus(): Promise<{
        status: any;
        runtimeEngine: {
            available: boolean;
            activeExecutions: any;
        };
        core: {
            available: boolean;
            tenantId: any;
        };
    }>;
    getModules(): Promise<any>;
    getPlugins(): Promise<any>;
    getEvents(): Promise<{
        name: string;
        subscribers: any;
    }[]>;
    getHealth(): Promise<{
        status: string;
        runtimeEngine: boolean;
        eventBus: boolean;
        moduleRegistry: boolean;
        pluginRegistry: boolean;
    }>;
}
//# sourceMappingURL=CoreRuntimeService.d.ts.map