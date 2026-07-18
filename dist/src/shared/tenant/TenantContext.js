"use strict";
module.exports = require("../../core/security/TenantContext");
class TenantContext {
    constructor({ tenantId, source = "unknown" } = {}) {
        if (!tenantId) {
            throw new Error("El tenantId es obligatorio.");
        }
        this.tenantId = tenantId;
        this.source = source;
    }
    static from(value) {
        if (value instanceof TenantContext) {
            return value;
        }
        if (typeof value === "string") {
            return new TenantContext({ tenantId: value, source: "string" });
        }
        if (value && typeof value === "object") {
            return new TenantContext({ tenantId: value.tenantId, source: value.source || "object" });
        }
        throw new Error("No se puede crear un TenantContext a partir del valor proporcionado.");
    }
}
module.exports = TenantContext;
//# sourceMappingURL=TenantContext.js.map