import { Capability } from "../domain/Capability";
import { CapabilityRepository } from "../domain/CapabilityRegistry";

export class InMemoryCapabilityRepository implements CapabilityRepository {
  private capabilities: Map<string, Capability> = new Map();

  async save(capability: Capability): Promise<Capability> {
    this.capabilities.set(capability.name, capability);
    return capability;
  }

  async findByName(name: string): Promise<Capability | null> {
    return this.capabilities.get(name) || null;
  }

  clear(): void {
    this.capabilities.clear();
  }
}
