class DomainEvent {
    constructor() {
        this.name = this.constructor.eventName || this.constructor.name;
        this.occurredAt = new Date();
    }
}

module.exports = DomainEvent;
