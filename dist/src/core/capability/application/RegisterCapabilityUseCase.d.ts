declare const Capability: any;
declare class RegisterCapabilityUseCase {
    constructor({ capabilityRegistry, eventPublisher }: {
        capabilityRegistry: any;
        eventPublisher: any;
    });
    execute({ name, version, requiredPermissions, lifecycle, handler }: {
        name: any;
        version?: string;
        requiredPermissions?: any[];
        lifecycle?: string;
        handler: any;
    }): Promise<any>;
}
//# sourceMappingURL=RegisterCapabilityUseCase.d.ts.map