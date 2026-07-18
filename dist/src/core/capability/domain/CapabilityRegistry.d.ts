declare const Capability: any;
declare const ValidationError: any;
declare class CapabilityRegistry {
    constructor({ capabilityRepository }: {
        capabilityRepository: any;
    });
    register(capability: any): Promise<Capability>;
    findByName(name: any): Promise<any>;
}
//# sourceMappingURL=CapabilityRegistry.d.ts.map