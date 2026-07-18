declare const EventEmitter: any;
declare const ComponentManifest: any;
declare const COMPONENT_REGISTERED = "COMPONENT_REGISTERED";
declare const COMPONENT_STARTED = "COMPONENT_STARTED";
declare const COMPONENT_STOPPED = "COMPONENT_STOPPED";
declare const COMPONENT_FAILED = "COMPONENT_FAILED";
declare const VALID_TYPES: string[];
declare class ArchitectureRegistry {
    constructor({ eventBus, logger, metrics, dbClient, cacheClient, storageClient, moduleRegistry, pluginRegistry, abielCore, runtimeEngine }?: {});
    _key(type: any, id: any): string;
    _ensureType(type: any): string;
    registerComponent(component?: {}): {
        id: string;
        name: any;
        type: string;
        version: any;
        status: any;
        description: any;
        dependencies: any;
        capabilities: any;
        config: any;
        metadata: any;
        compatibleCore: any;
        createdAt: any;
        updatedAt: string;
        healthFn: any;
        metricsFn: any;
        raw: any;
    };
    removeComponent(type: any, id: any): any;
    getComponent(type: any, id: any): any;
    listComponents(type: any): unknown[];
    getDependencies(type: any, id: any): any;
    getDependencyGraph(): {
        nodes: {
            id: any;
            name: any;
            type: any;
            version: any;
        }[];
        edges: any[];
    };
    getArchitectureTree(): any[];
    getOverview(): {
        core: {
            components: unknown[];
            count: number;
        };
        engines: unknown[];
        modules: unknown[];
        shared: unknown[];
        plugins: unknown[];
        services: unknown[];
        graph: {
            nodes: {
                id: any;
                name: any;
                type: any;
                version: any;
            }[];
            edges: any[];
        };
        tree: any[];
        totals: {
            core: number;
            engines: number;
            modules: number;
            shared: number;
            plugins: number;
            services: number;
        };
    };
    getComponentDetail(type: any, id: any): Promise<any>;
    _resolveHealth(component: any): Promise<any>;
    _resolveMetrics(component: any): Promise<any>;
    updateStatus(type: any, id: any, status: any, metadata?: {}): any;
    recordEvent(eventType: any, component: any, payload?: {}): {
        id: string;
        eventType: any;
        timestamp: string;
        component: {
            id: any;
            name: any;
            type: any;
        };
        payload: {};
    };
    getHistory(filters?: {}): any;
    on(eventType: any, listener: any): void;
    off(eventType: any, listener: any): void;
    getRuntimeSnapshot(): {
        process: {
            pid: number;
            platform: NodeJS.Platform;
            nodeVersion: string;
            uptimeSeconds: number;
        };
        runtimeEngine: {
            available: boolean;
            type: any;
            activeExecutions: any;
            hasPermissionChecker: boolean;
            hasErrorClassifier: boolean;
        };
        eventBus: {
            available: boolean;
            type: any;
            handlers: any;
        };
        memory: {
            rss: number;
            heapUsed: number;
            heapTotal: number;
        };
    };
    getMetricsSnapshot(): {
        heapUsed: number;
        heapTotal: number;
        rss: number;
        cpuCount: any;
        uptimeSeconds: number;
        components: {
            total: any;
        };
    };
}
//# sourceMappingURL=ArchitectureRegistry.d.ts.map