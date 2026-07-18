"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    fields;
    constructor(message, fields = {}) {
        super(message);
        this.name = "ValidationError";
        this.fields = fields;
    }
}
exports.ValidationError = ValidationError;
exports.default = ValidationError;
// CommonJS compatibility
try {
    // @ts-ignore
    module.exports = ValidationError;
    // @ts-ignore
    module.exports.ValidationError = ValidationError;
}
catch (e) { }
//# sourceMappingURL=ValidationError.js.map