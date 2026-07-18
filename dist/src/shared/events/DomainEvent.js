"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const crypto_1 = require("crypto");
class DomainEvent {
    id;
    name;
    occurredAt;
    constructor() {
        this.id = (0, crypto_1.randomUUID)();
        this.name = this.constructor.eventName || this.constructor.name;
        this.occurredAt = new Date();
    }
}
exports.DomainEvent = DomainEvent;
//# sourceMappingURL=DomainEvent.js.map