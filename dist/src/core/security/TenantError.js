"use strict";
class TenantError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = "TenantError";
        this.details = details;
    }
}
module.exports = TenantError;
//# sourceMappingURL=TenantError.js.map