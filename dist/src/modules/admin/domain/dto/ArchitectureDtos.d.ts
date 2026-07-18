declare class CoreInfoDto {
    constructor({ tenant, capabilityRegistry, eventBus, pluginRegistry, metadata }?: {});
}
declare class EngineInfoDto {
    constructor({ runtimeEngine, eventDispatcher, details }?: {});
}
declare class ModuleInfoDto {
    constructor({ name, path, available, loaded, source }?: {});
}
declare class SharedServiceInfoDto {
    constructor({ name, available, type, metadata }?: {});
}
declare class RuntimeStateDto {
    constructor({ processInfo, runtimeEngine, eventBus, memory, activeExecutions, handlerCount }?: {});
}
declare class ArchitectureOverviewDto {
    constructor({ core, engines, modules, shared, runtime }?: {});
}
//# sourceMappingURL=ArchitectureDtos.d.ts.map