export interface TraceContextShape {
  traceId: string;
  tenantId?: string;
  eventName?: string;
}

export class TraceContext {
  private traceId: string;
  private tenantId?: string;
  private eventName?: string;

  constructor({ traceId, tenantId, eventName }: TraceContextShape) {
    this.traceId = traceId || "trace-default";
    this.tenantId = tenantId;
    this.eventName = eventName;
  }

  toJSON(): TraceContextShape {
    return {
      traceId: this.traceId,
      tenantId: this.tenantId,
      eventName: this.eventName,
    };
  }
}
