"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbielCore = void 0;
const CapabilityRegistry_1 = require("./capability/domain/CapabilityRegistry");
const EventBus_1 = require("./kernel/events/EventBus");
const TenantContext_1 = require("./security/TenantContext");
const Logger_1 = require("./observability/Logger");
const Metrics_1 = require("./observability/Metrics");
const HealthCheck_1 = require("./observability/HealthCheck");
class AbielCore {
    tenantContext;
    eventBus;
    capabilityRegistry;
    logger;
    metrics;
    healthCheck;
    constructor(config) {
        if (!config || !config.tenantId) {
            throw new Error("AbielCore requires a tenantId");
        }
        this.tenantContext = TenantContext_1.TenantContext.from(config.tenantId);
        this.eventBus = config.eventBus || new (EventBus_1.EventBus.EventBus || EventBus_1.EventBus)();
        this.logger = config.logger || new Logger_1.ConsoleLogger();
        this.metrics = config.metrics || new Metrics_1.Metrics();
        this.healthCheck = config.healthCheck || new HealthCheck_1.HealthCheck();
        this.capabilityRegistry = config.capabilityRegistry || new CapabilityRegistry_1.CapabilityRegistry({
            capabilityRepository: {
                async save(capability) {
                    return capability;
                },
                async findByName(name) {
                    return null;
                },
            },
        });
        this.logger.info("core.initialized", { tenantId: this.tenantContext.tenantId, source: config.source || "unknown" });
    }
    getTenantContext() {
        return this.tenantContext;
    }
    getEventBus() {
        return this.eventBus;
    }
    getCapabilityRegistry() {
        return this.capabilityRegistry;
    }
    async registerCapability(capability) {
        const registered = await this.capabilityRegistry.register(capability);
        this.metrics.recordCapabilityRegistered();
        this.logger.info("capability.registered", { capability: registered.name, tenantId: this.tenantContext.tenantId });
        return registered;
    }
    start() {
        this.metrics.recordEventPublished();
        this.eventBus.publish({ name: "AbielCoreStarted", tenantId: this.tenantContext.tenantId });
        this.logger.info("core.started", {
            tenantId: this.tenantContext.tenantId,
            capabilities: this.metrics.snapshot().capabilitiesRegistered,
            eventsPublished: this.metrics.snapshot().eventsPublished,
            status: this.healthCheck.getStatus(),
        });
        return this;
    }
}
exports.AbielCore = AbielCore;
//# sourceMappingURL=AbielCore.js.map