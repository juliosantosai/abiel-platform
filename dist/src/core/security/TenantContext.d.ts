export declare class TenantContext {
    tenantId: string;
    source: string;
    constructor({ tenantId, source }?: {
        source?: string;
    });
    static from(value: string | TenantContext | {
        tenantId?: string;
        source?: string;
    }): TenantContext;
}
export default TenantContext;
//# sourceMappingURL=TenantContext.d.ts.map