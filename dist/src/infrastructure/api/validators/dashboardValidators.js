"use strict";
const ApiHttpException = require("../errors/ApiHttpException");
function validateDashboardTenant(req) {
    const empresaId = req?.tenantContext?.tenantId;
    if (!empresaId) {
        throw new ApiHttpException({
            status: 401,
            code: "TENANT_CONTEXT_REQUIRED",
            message: "No se pudo determinar la empresa del usuario.",
        });
    }
    return empresaId;
}
function validateDashboardLimit(query = {}) {
    if (!query.limit) {
        return 10;
    }
    const parsed = Number.parseInt(query.limit, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return 10;
    }
    return Math.min(parsed, 100);
}
module.exports = {
    validateDashboardTenant,
    validateDashboardLimit,
};
//# sourceMappingURL=dashboardValidators.js.map