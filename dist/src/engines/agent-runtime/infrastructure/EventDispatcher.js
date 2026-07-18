"use strict";
class EventDispatcher {
    constructor(eventBus) {
        if (!eventBus || typeof eventBus.publish !== "function") {
            throw new Error("EventDispatcher requires an eventBus with publish(event)");
        }
        this.eventBus = eventBus;
    }
    async dispatch(name, payload = {}) {
        await this.eventBus.publish({
            name,
            payload,
            occurredAt: new Date()
        });
    }
}
module.exports = EventDispatcher;
//# sourceMappingURL=EventDispatcher.js.map