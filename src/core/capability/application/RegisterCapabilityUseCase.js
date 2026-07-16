const Capability = require("../domain/Capability");

class RegisterCapabilityUseCase {
    constructor({ capabilityRegistry, eventPublisher }) {
        this.capabilityRegistry = capabilityRegistry;
        this.eventPublisher = eventPublisher;
    }

    async execute({ name, version = "1.0.0", requiredPermissions = [], lifecycle = "active", handler }) {
        const capability = new Capability({
            name,
            version,
            requiredPermissions,
            lifecycle,
            handler
        });

        const registered = await this.capabilityRegistry.register(capability);

        if (this.eventPublisher && typeof this.eventPublisher.publish === "function") {
            await this.eventPublisher.publish({
                name: "CapabilityRegistered",
                payload: {
                    capabilityName: registered.name,
                    version: registered.version,
                    lifecycle: registered.lifecycle
                }
            });
        }

        return registered;
    }
}

module.exports = RegisterCapabilityUseCase;