module.exports = require("../../../core/capability/infrastructure/InMemoryCapabilityRepository");class InMemoryCapabilityRepository {
    constructor() {
        this.capabilities = new Map();
    }

    async save(capability) {
        this.capabilities.set(capability.name, capability);
        return capability;
    }

    async findByName(name) {
        return this.capabilities.get(name) || null;
    }

    clear() {
        this.capabilities.clear();
    }
}

module.exports = InMemoryCapabilityRepository;