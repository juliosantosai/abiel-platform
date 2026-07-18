"use strict";
const ApiHttpException = require('../../../infrastructure/api/errors/ApiHttpException');
function resolveTenant(req, res, next) {
    const headerTenantId = req.headers['x-tenant-id'];
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId || req.user?.empresaId || req.usuario?.empresaId || headerTenantId;
    if (!tenantId) {
        return next(new ApiHttpException({
            status: 400,
            code: 'TENANT_REQUIRED',
            message: 'Tenant context is required.',
        }));
    }
    req.tenant = {
        tenantId,
        source: req.tenantContext?.source || (headerTenantId ? 'header' : 'auth'),
    };
    return next();
}
module.exports = {
    resolveTenant,
};
//# sourceMappingURL=tenantMiddleware.js.map