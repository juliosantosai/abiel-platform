declare const ApiResponse: any;
declare const AdminService: any;
declare class AdminSurfaceController {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer, moduleRegistry, pluginRegistry }?: {});
    dashboard(req: any, res: any): Promise<void>;
    eventbus(req: any, res: any): Promise<void>;
    capabilities(req: any, res: any): Promise<void>;
    memory(req: any, res: any): Promise<void>;
    tenants(req: any, res: any): Promise<void>;
    health(req: any, res: any): Promise<void>;
    metrics(req: any, res: any): Promise<void>;
    logs(req: any, res: any): Promise<void>;
    architecture(req: any, res: any): Promise<void>;
    core(req: any, res: any): Promise<void>;
    engines(req: any, res: any): Promise<void>;
    modules(req: any, res: any): Promise<void>;
    plugins(req: any, res: any): Promise<void>;
    shared(req: any, res: any): Promise<void>;
    architectureModules(req: any, res: any): Promise<void>;
    componentDetail(req: any, res: any): Promise<any>;
    runtime(req: any, res: any): Promise<void>;
    config(req: any, res: any): Promise<void>;
}
//# sourceMappingURL=AdminSurfaceController.d.ts.map