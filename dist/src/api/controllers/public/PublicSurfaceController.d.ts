declare const ApiResponse: any;
declare const PublicCatalogService: any;
declare class PublicSurfaceController {
    constructor({ publicCatalogService, ...dependencies }?: {});
    signup(req: any, res: any): Promise<void>;
    plans(req: any, res: any): Promise<void>;
    demo(req: any, res: any): Promise<void>;
}
//# sourceMappingURL=PublicSurfaceController.d.ts.map