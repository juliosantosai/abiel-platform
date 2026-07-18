declare const ValidationError: any;
declare class Capability {
    constructor({ name, version, requiredPermissions, lifecycle, handler }: {
        name: any;
        version?: string;
        requiredPermissions?: any[];
        lifecycle?: string;
        handler: any;
    });
    isExecutable(): boolean;
    execute(input: any, executionContext: any): Promise<any>;
}
//# sourceMappingURL=Capability.d.ts.map