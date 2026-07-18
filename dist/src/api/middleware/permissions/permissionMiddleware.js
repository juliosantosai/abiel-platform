"use strict";
const ApiHttpException = require('../../../infrastructure/api/errors/ApiHttpException');
const { PLATFORM_ROLES } = require('../../contracts');
function normalizeRole(user = {}) {
    return user.role || user.rol || null;
}
function requireRoles(allowedRoles = []) {
    return (req, res, next) => {
        const user = req.user || req.usuario || {};
        const role = normalizeRole(user);
        if (!role) {
            return next(new ApiHttpException({
                status: 401,
                code: 'ROLE_REQUIRED',
                message: 'Authenticated role is required.',
            }));
        }
        if (!allowedRoles.includes(role)) {
            return next(new ApiHttpException({
                status: 403,
                code: 'INSUFFICIENT_PERMISSIONS',
                message: 'The current role does not have access to this resource.',
                details: { role, allowedRoles },
            }));
        }
        return next();
    };
}
module.exports = {
    PLATFORM_ROLES,
    normalizeRole,
    requireRoles,
};
//# sourceMappingURL=permissionMiddleware.js.map