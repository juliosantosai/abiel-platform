"use strict";
function createMetadata(req, extra = {}) {
    return {
        requestId: req?.requestContext?.requestId,
        correlationId: req?.requestContext?.correlationId,
        timestamp: new Date().toISOString(),
        ...extra,
    };
}
module.exports = { createMetadata };
//# sourceMappingURL=Metadata.js.map