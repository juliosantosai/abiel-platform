"use strict";
const { createMetadata } = require("./Metadata");
function ok({ req, data, pagination, cursor, metadata = {} }) {
    const response = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
    };
    if (pagination) {
        response.pagination = pagination;
    }
    if (cursor) {
        response.cursor = cursor;
    }
    if (Object.keys(metadata).length > 0 || req?.requestContext) {
        response.metadata = createMetadata(req, metadata);
    }
    return response;
}
function created({ req, data, metadata = {} }) {
    return ok({ req, data, metadata });
}
module.exports = { ok, created };
//# sourceMappingURL=ApiResponse.js.map