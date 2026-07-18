"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capability = void 0;
const ValidationError_1 = require("../../../shared/errors/ValidationError");
class Capability {
    name;
    version;
    requiredPermissions;
    lifecycle;
    handler;
    constructor({ name, version = "1.0.0", requiredPermissions = [], lifecycle = "active", handler }) {
        if (!name || typeof name !== "string") {
            throw new ValidationError_1.ValidationError("Capability name is required", { name: "required" });
        }
        if (typeof handler !== "function") {
            throw new ValidationError_1.ValidationError("Capability handler must be a function", { handler: "invalid" });
        }
        this.name = name;
        this.version = version;
        this.requiredPermissions = Array.isArray(requiredPermissions) ? requiredPermissions : [];
        this.lifecycle = lifecycle;
        this.handler = handler;
    }
    isExecutable() {
        return this.lifecycle === "active" || this.lifecycle === "deprecated";
    }
    async execute(input, executionContext) {
        if (!this.isExecutable()) {
            const error = new Error(`Capability ${this.name} is not executable`);
            error.code = "CAPABILITY_UNAVAILABLE";
            throw error;
        }
        return this.handler(input, executionContext);
    }
}
exports.Capability = Capability;
exports.default = Capability;
// CommonJS compatibility
try {
    // @ts-ignore
    module.exports = Capability;
    // @ts-ignore
    module.exports.Capability = Capability;
}
catch (e) { }
//# sourceMappingURL=Capability.js.map