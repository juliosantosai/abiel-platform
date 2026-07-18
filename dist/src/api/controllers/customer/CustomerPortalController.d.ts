declare const ApiResponse: any;
declare const CustomerPortalService: any;
declare class CustomerPortalController {
    constructor({ customerPortalService, ...dependencies }?: {});
    profile(req: any, res: any): Promise<void>;
    usage(req: any, res: any): Promise<void>;
    agents(req: any, res: any): Promise<void>;
    conversations(req: any, res: any): Promise<void>;
    knowledge(req: any, res: any): Promise<void>;
}
//# sourceMappingURL=CustomerPortalController.d.ts.map