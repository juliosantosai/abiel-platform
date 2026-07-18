"use strict";
function createApiError({ problem, metadata }) {
    return {
        success: false,
        error: problem?.title || "Error",
        code: problem?.code,
        fields: problem?.fields,
        details: problem?.details,
        problem,
        metadata,
    };
}
module.exports = { createApiError };
//# sourceMappingURL=ApiError.js.map