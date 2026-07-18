"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbielCore = void 0;
const Capability = require("./capability/domain/Capability");
const CapabilityRegistry = require("./capability/domain/CapabilityRegistry");
const EventBus = require("./kernel/events/EventBus");
const TenantContext = require("./security/TenantContext");
const { ConsoleLogger } = require("./observability/Logger");
const { Metrics } = require("./observability/Metrics");
const { HealthCheck } = require("./observability/HealthCheck");
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
        this.tenantContext = TenantContext.from(config.tenantId);
        this.eventBus = config.eventBus || new (EventBus.EventBus || EventBus)();
        this.logger = config.logger || new ConsoleLogger();
        this.metrics = config.metrics || new Metrics();
        this.healthCheck = config.healthCheck || new HealthCheck();
        this.capabilityRegistry = config.capabilityRegistry || new CapabilityRegistry({
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