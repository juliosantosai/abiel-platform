const ValidationError: new (message: string, fields?: Record<string, unknown>) => Error =
  require("../../../shared/errors/ValidationError");
import { Capability } from "./Capability";

export interface CapabilityRepository {
  save(capability: Capability): Promise<Capability>;
  findByName(name: string): Promise<Capability | null>;
}

export class CapabilityRegistry {
  capabilityRepository: CapabilityRepository;

  constructor({ capabilityRepository }: { capabilityRepository: CapabilityRepository }) {
    if (!capabilityRepository) {
      throw new ValidationError("capabilityRepository is required", { capabilityRepository: "required" });
    }

    this.capabilityRepository = capabilityRepository;
  }

  async register(capability: Capability): Promise<Capability> {
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

  async findByName(name: string): Promise<Capability | null> {
    return this.capabilityRepository.findByName(name);
  }
}
