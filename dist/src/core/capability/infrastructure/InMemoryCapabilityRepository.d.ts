declare class InMemoryCapabilityRepository {
    constructor();
    save(capability: any): Promise<any>;
    findByName(name: any): Promise<any>;
    clear(): void;
}
//# sourceMappingURL=InMemoryCapabilityRepository.d.ts.map