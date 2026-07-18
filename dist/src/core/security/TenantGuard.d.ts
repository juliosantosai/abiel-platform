declare const TenantContext: any;
declare const TenantError: any;
declare class TenantGuard {
    constructor({ tenantContext }?: {});
    setContext(tenantContext: any): void;
    clearContext(): void;
    ensureTenantContext(tenantContext?: any): any;
    ensureSameTenant(resourceTenantId: any, tenantContext?: any): any;
    ensureTenantMatches(resource: any, tenantContext?: any): any;
}
//# sourceMappingURL=TenantGuard.d.ts.map