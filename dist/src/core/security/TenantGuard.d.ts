declare const TenantContext: any;
declare const TenantError: any;
declare class TenantGuard {
    constructor({ tenantContext }?: {});
    setContext(tenantContext: any): void;
    clearContext(): void;
    ensureTenantContext(tenantContext?: any): TenantContext;
    ensureSameTenant(resourceTenantId: any, tenantContext?: any): TenantContext;
    ensureTenantMatches(resource: any, tenantContext?: any): TenantContext;
}
//# sourceMappingURL=TenantGuard.d.ts.map