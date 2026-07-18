declare const CoreFacade: any;
declare const ArchitectureDiscoveryService: any;
declare class AdminService {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer, moduleRegistry, pluginRegistry }?: {});
    getDashboard(): Promise<{
        version: string;
        uptime: number;
        status: string;
        runtime: any;
        memory: {
            heapUsed: number;
            rss: number;
        };
        eventBus: any;
        capabilities: number;
        tenants: number;
    }>;
    getStatus(): {
        service: string;
        environment: "development" | "test" | "production";
        adminApiEnabled: boolean;
        adminTokenConfigured: boolean;
        serverTime: string;
        version: string;
    };
    getRuntime(): Promise<any>;
    getEventBus(): Promise<any>;
    getCapabilities(): Promise<any>;
    getMemory(): Promise<{
        sessions: number;
        conversations: number;
        cache: {};
        buffers: {};
    }>;
    getTenants(): Promise<{
        active: any;
        registered: any[];
        context: {};
    }>;
    getHealth(): Promise<{
        database: string;
        redis: string;
        runtime: string;
        eventBus: string;
        core: string;
    }>;
    getRuntimeState(): Promise<any>;
    getMetrics(): Promise<any>;
    getLogs({ page, perPage, level, from, to }?: {
        page?: number;
        perPage?: number;
    }): Promise<any>;
    getConfig(): Promise<{
        version: string;
        port: string;
        mode: "development" | "test" | "production";
        env: {
            NODE_ENV: "development" | "test" | "production";
        };
    }>;
    getOverview(): Promise<{
        status: {
            service: string;
            environment: "development" | "test" | "production";
            adminApiEnabled: boolean;
            adminTokenConfigured: boolean;
            serverTime: string;
            version: string;
        };
        health: {
            database: string;
            redis: string;
            runtime: string;
            eventBus: string;
            core: string;
        };
        runtime: any;
    }>;
    getArchitectureOverview(): Promise<any>;
    getCoreInfo(): Promise<any>;
    getEnginesInfo(): Promise<any>;
    getModulesInfo(): Promise<any>;
    getPluginsInfo(): Promise<any>;
    getArchitectureModules(): Promise<any>;
    getSharedServicesInfo(): Promise<any>;
    getRuntimeInfo(): Promise<any>;
    getComponentDetail(type: any, id: any): Promise<any>;
}
//# sourceMappingURL=AdminService.d.ts.map