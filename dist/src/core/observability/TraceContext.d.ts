export interface TraceContextShape {
    traceId: string;
    tenantId?: string;
    eventName?: string;
}
export declare class TraceContext {
    private traceId;
    private tenantId?;
    private eventName?;
    constructor({ traceId, tenantId, eventName }: TraceContextShape);
    toJSON(): TraceContextShape;
}
//# sourceMappingURL=TraceContext.d.ts.map