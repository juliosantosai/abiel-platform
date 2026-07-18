"use strict";
function createApiError({ problem, metadata }) {
    const code = problem?.code || null;
    const message = problem?.title || "Error";
    const fields = problem?.fields;
    const details = problem?.details;
    return {
        success: false,
        error: { code, message },
        // keep legacy top-level fields for backward compatibility
        code,
        fields,
        details,
        problem,
        metadata,
        timestamp: new Date().toISOString(),
    };
}
module.exports = { createApiError };
//# sourceMappingURL=ApiError.js.map