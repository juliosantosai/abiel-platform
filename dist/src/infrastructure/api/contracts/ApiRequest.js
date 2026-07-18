"use strict";
function createApiRequest(req) {
    return {
        path: req.path,
        method: req.method,
        params: req.params || {},
        query: req.query || {},
        body: req.body || {},
        tenantContext: req.tenantContext || null,
        user: req.usuario || null,
        requestContext: req.requestContext || null,
    };
}
module.exports = { createApiRequest };
//# sourceMappingURL=ApiRequest.js.map