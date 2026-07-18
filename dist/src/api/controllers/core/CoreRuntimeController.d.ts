declare const ApiResponse: any;
declare const CoreRuntimeService: any;
declare class CoreRuntimeController {
    constructor({ coreRuntimeService, ...dependencies }?: {});
    runtimeStatus(req: any, res: any): Promise<void>;
    modules(req: any, res: any): Promise<void>;
    plugins(req: any, res: any): Promise<void>;
    events(req: any, res: any): Promise<void>;
    health(req: any, res: any): Promise<void>;
}
//# sourceMappingURL=CoreRuntimeController.d.ts.map