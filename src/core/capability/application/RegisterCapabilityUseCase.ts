import { Capability, CapabilityHandler, CapabilityLifecycle } from "../domain/Capability";
import { CapabilityRegistry } from "../domain/CapabilityRegistry";

export interface EventPublisherLike {
  publish(event: { name: string; payload: Record<string, unknown> }): Promise<void>;
}

export class RegisterCapabilityUseCase {
  capabilityRegistry: CapabilityRegistry;
  eventPublisher?: EventPublisherLike;

  constructor({ capabilityRegistry, eventPublisher }: { capabilityRegistry: CapabilityRegistry; eventPublisher?: EventPublisherLike }) {
    this.capabilityRegistry = capabilityRegistry;
    this.eventPublisher = eventPublisher;
  }

  async execute({
    name,
    version = "1.0.0",
    requiredPermissions = [],
    lifecycle = "active",
    handler,
  }: {
    name: string;
    version?: string;
    requiredPermissions?: string[];
    lifecycle?: CapabilityLifecycle;
    handler: CapabilityHandler;
  }): Promise<Capability> {
    const capability = new Capability({
      name,
      version,
      requiredPermissions,
      lifecycle,
      handler,
    });

    const registered = await this.capabilityRegistry.register(capability);

    if (this.eventPublisher && typeof this.eventPublisher.publish === "function") {
      await this.eventPublisher.publish({
        name: "CapabilityRegistered",
        payload: {
          capabilityName: registered.name,
          version: registered.version,
          lifecycle: registered.lifecycle,
        },
      });
    }

    return registered;
  }
}
