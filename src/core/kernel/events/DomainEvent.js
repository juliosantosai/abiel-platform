const { randomUUID } = require("crypto");

class DomainEvent {
    constructor() {
        this.id = randomUUID();
        this.name = this.constructor.eventName || this.constructor.name;
        this.occurredAt = new Date();
    }
}

module.exports = DomainEvent;
