"use strict";
const { randomUUID } = require("crypto");
function requestContextMiddleware(req, res, next) {
    const requestId = req.headers["x-request-id"] || randomUUID();
    const correlationId = req.headers["x-correlation-id"] || requestId;
    req.requestContext = {
        requestId,
        correlationId,
        startedAt: Date.now(),
    };
    res.setHeader("x-request-id", requestId);
    res.setHeader("x-correlation-id", correlationId);
    next();
}
module.exports = { requestContextMiddleware };
//# sourceMappingURL=requestContext.js.map