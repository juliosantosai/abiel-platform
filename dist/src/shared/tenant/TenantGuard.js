"use strict";
module.exports = require("../../core/security/TenantGuard");
const TenantContext = require("./TenantContext");
const TenantError = require("./TenantError");
class TenantGuard {
    constructor({ tenantContext } = {}) {
        this.tenantContext = tenantContext || null;
    }
    setContext(tenantContext) {
        this.tenantContext = TenantContext.from(tenantContext);
    }
    clearContext() {
        this.tenantContext = null;
    }
    ensureTenantContext(tenantContext = this.tenantContext) {
        const context = tenantContext ? TenantContext.from(tenantContext) : null;
        if (!context) {
            throw new TenantError("No existe un contexto de tenant activo.");
        }
        return context;
    }
    ensureSameTenant(resourceTenantId, tenantContext = this.tenantContext) {
        const context = this.ensureTenantContext(tenantContext);
        if (resourceTenantId !== context.tenantId) {
            throw new TenantError("El recurso no pertenece al tenant actual.");
        }
        return context;
    }
    ensureTenantMatches(resource, tenantContext = this.tenantContext) {
        if (!resource) {
            throw new TenantError("No se puede validar un recurso nulo.");
        }
        const tenantId = resource.tenantId || resource.empresaId || resource.tenant?.id;
        return this.ensureSameTenant(tenantId, tenantContext);
    }
}
module.exports = TenantGuard;
//# sourceMappingURL=TenantGuard.js.map