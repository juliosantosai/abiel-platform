"use strict";
const { autenticar } = require('../../../infrastructure/api/interfaces/middleware/auth');
function authenticateRequest(req, res, next) {
    return autenticar(req, res, (err) => {
        if (err) {
            return next(err);
        }
        req.user = req.user || req.usuario || null;
        return next();
    });
}
function optionalAuth(req, res, next) {
    const auth = req.headers.authorization || '';
    if (!auth.trim()) {
        return next();
    }
    return authenticateRequest(req, res, next);
}
function resolveSessionUser(req, res, next) {
    req.user = req.user || req.usuario || null;
    return next();
}
module.exports = {
    authenticateRequest,
    optionalAuth,
    resolveSessionUser,
};
//# sourceMappingURL=authMiddleware.js.map