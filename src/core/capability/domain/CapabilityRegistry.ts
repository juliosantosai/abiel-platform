const Capability = require("./Capability");
const ValidationError = require("../../../shared/errors/ValidationError");

class CapabilityRegistry {
    constructor({ capabilityRepository }) {
        if (!capabilityRepository) {
            throw new ValidationError("capabilityRepository is required", { capabilityRepository: "required" });
        }

        this.capabilityRepository = capabilityRepository;
    }

    async register(capability) {
        if (!(capability instanceof Capability)) {
            throw new ValidationError("CapabilityRegistry.register requires a Capability instance");
        }

        const existing = await this.capabilityRepository.findByName(capability.name);
        if (existing) {
            throw new ValidationError("Capability already registered", { name: capability.name });
        }

        await this.capabilityRepository.save(capability);
        return capability;
    }

    async findByName(name) {
        return this.capabilityRepository.findByName(name);
    }
}

module.exports = CapabilityRegistry;