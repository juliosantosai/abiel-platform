export {};
export interface AbielCoreConfig {
    tenantId: string;
    source?: string;
    eventBus?: any;
    capabilityRegistry?: any;
    logger?: any;
    metrics?: any;
    healthCheck?: any;
}
export declare class AbielCore {
    private tenantContext;
    private eventBus;
    private capabilityRegistry;
    private logger;
    private metrics;
    private healthCheck;
    constructor(config: AbielCoreConfig);
    getTenantContext(): TenantContext;
    getEventBus(): EventBus;
    getCapabilityRegistry(): CapabilityRegistry;
    registerCapability(capability: Capability): Promise<Capability>;
    start(): AbielCore;
}
//# sourceMappingURL=AbielCore.d.ts.map