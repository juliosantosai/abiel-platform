"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = void 0;
class HealthCheck {
    checks;
    constructor() {
        this.checks = {
            core: true,
            tenant: true,
            events: true,
        };
    }
    mark(checkName, healthy) {
        this.checks[checkName] = healthy;
    }
    getStatus() {
        const ok = Object.values(this.checks).every(Boolean);
        return {
            status: ok ? "ok" : "degraded",
            checks: this.checks,
        };
    }
}
exports.HealthCheck = HealthCheck;
//# sourceMappingURL=HealthCheck.js.map