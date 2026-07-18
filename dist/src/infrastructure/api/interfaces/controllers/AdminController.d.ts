declare const ApiResponse: any;
declare const AdminService: any;
declare class AdminController {
    constructor({ adminService }?: {});
    getStatus(req: any, res: any, next: any): Promise<any>;
    getHealth(req: any, res: any, next: any): Promise<any>;
    getRuntime(req: any, res: any, next: any): Promise<any>;
    getOverview(req: any, res: any, next: any): Promise<any>;
}
//# sourceMappingURL=AdminController.d.ts.map