"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metrics = void 0;
class Metrics {
    startedAt;
    eventsPublished = 0;
    capabilitiesRegistered = 0;
    constructor() {
        this.startedAt = new Date();
    }
    recordEventPublished() {
        this.eventsPublished += 1;
    }
    recordCapabilityRegistered() {
        this.capabilitiesRegistered += 1;
    }
    snapshot() {
        return {
            startedAt: this.startedAt.toISOString(),
            eventsPublished: this.eventsPublished,
            capabilitiesRegistered: this.capabilitiesRegistered,
        };
    }
}
exports.Metrics = Metrics;
//# sourceMappingURL=Metrics.js.map