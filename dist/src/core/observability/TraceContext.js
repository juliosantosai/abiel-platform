"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceContext = void 0;
class TraceContext {
    traceId;
    tenantId;
    eventName;
    constructor({ traceId, tenantId, eventName }) {
        this.traceId = traceId || "trace-default";
        this.tenantId = tenantId;
        this.eventName = eventName;
    }
    toJSON() {
        return {
            traceId: this.traceId,
            tenantId: this.tenantId,
            eventName: this.eventName,
        };
    }
}
exports.TraceContext = TraceContext;
//# sourceMappingURL=TraceContext.js.map