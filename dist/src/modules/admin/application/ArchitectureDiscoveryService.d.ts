declare const fs: any;
declare const path: any;
declare const ArchitectureRegistry: any;
declare const ArchitectureComponentDto: any;
declare const ArchitectureComponentDetailDto: any;
declare const ArchitectureOverviewDto: any;
declare class ArchitectureDiscoveryService {
    constructor({ abielCore, runtimeEngine, eventBus, moduleRegistry, pluginRegistry, dbClient, cacheClient, storageClient, logger, metrics }?: {});
    buildRegistry(): void;
    discoverCore(): {
        tenant: {
            activeTenantId: any;
            hasTenantContext: boolean;
        };
        capabilityRegistry: {
            available: boolean;
            type: any;
            supportsFindAll: any;
        };
        eventBus: {
            available: boolean;
            type: any;
        };
        pluginRegistry: {
            available: boolean;
            type: any;
            count: any;
        };
        metadata: {
            coreType: any;
        };
    };
    discoverEngines(): {
        runtimeEngine: {
            available: boolean;
            type: any;
            activeExecutions: any;
            hasPermissionChecker: boolean;
            hasErrorClassifier: boolean;
        };
        eventDispatcher: {
            available: boolean;
            type: any;
        };
        details: {
            activeExecutionIds: unknown[];
        };
    };
    _listModules(): any;
    discoverModules(): any;
    _scanModuleDirectories(): any[];
    discoverSharedServices(): any;
    discoverPlugins(): any;
    discoverRuntimeState(): any;
    discoverGraph(): any;
    getArchitectureOverview(): any;
    getComponentDetail(type: any, id: any): Promise<any>;
}
//# sourceMappingURL=ArchitectureDiscoveryService.d.ts.map