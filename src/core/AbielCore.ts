import { Capability } from "./capability/domain/Capability";
import { CapabilityRegistry } from "./capability/domain/CapabilityRegistry";
import { EventBus } from "./kernel/events/EventBus";
import { TenantContext } from "./security/TenantContext";
import { ConsoleLogger } from "./observability/Logger";
import { Metrics } from "./observability/Metrics";
import { HealthCheck } from "./observability/HealthCheck";

export interface AbielCoreConfig {
  tenantId: string;
  source?: string;
  eventBus?: any;
  capabilityRegistry?: any;
  logger?: any;
  metrics?: any;
  healthCheck?: any;
}

export class AbielCore {
  private tenantContext: any;
  private eventBus: any;
  private capabilityRegistry: any;
  private logger: any;
  private metrics: any;
  private healthCheck: any;

  constructor(config: AbielCoreConfig) {
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
        async save(capability: Capability) {
          return capability;
        },
        async findByName(name: string) {
          return null;
        },
      },
    });

    this.logger.info("core.initialized", { tenantId: this.tenantContext.tenantId, source: config.source || "unknown" });
  }

  getTenantContext(): TenantContext {
    return this.tenantContext;
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }

  getCapabilityRegistry(): CapabilityRegistry {
    return this.capabilityRegistry;
  }

  async registerCapability(capability: Capability): Promise<Capability> {
    const registered = await this.capabilityRegistry.register(capability);
    this.metrics.recordCapabilityRegistered();
    this.logger.info("capability.registered", { capability: registered.name, tenantId: this.tenantContext.tenantId });
    return registered;
  }

  start(): AbielCore {
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
