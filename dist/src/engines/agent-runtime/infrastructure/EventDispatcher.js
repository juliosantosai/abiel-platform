"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
class EventDispatcher {
    eventBus;
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
            occurredAt: new Date(),
        });
    }
}
exports.EventDispatcher = EventDispatcher;
exports.default = EventDispatcher;
// CommonJS compatibility
try {
    // @ts-ignore
    module.exports = EventDispatcher;
    // @ts-ignore
    module.exports.EventDispatcher = EventDispatcher;
}
catch (e) { }
//# sourceMappingURL=EventDispatcher.js.map