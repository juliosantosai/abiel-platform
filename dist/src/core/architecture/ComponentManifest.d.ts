declare const os: any;
declare const VALID_TYPES: string[];
declare function normalizeStatus(status: any): string;
declare class ComponentManifest {
    constructor(input?: {});
    health(): Promise<{
        status: string;
        latency: any;
        memory: any;
        errors: any;
        checks: any;
    } | {
        status: any;
        latency: any;
        memory: any;
        errors: number;
        checks: {};
    }>;
    metrics(): Promise<any>;
    toJSON(): {
        id: any;
        name: any;
        type: any;
        version: any;
        description: any;
        capabilities: any;
        dependencies: any;
        status: any;
        metadata: any;
    };
}
//# sourceMappingURL=ComponentManifest.d.ts.map