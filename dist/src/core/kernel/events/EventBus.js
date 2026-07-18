"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalEventBus = exports.EventBus = void 0;
class EventBus {
    handlers;
    constructor() {
        this.handlers = {};
    }
    subscribe(eventName, handler) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(handler);
    }
    unsubscribe(eventName, handler) {
        if (!this.handlers[eventName])
            return;
        this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
    }
    async publish(event) {
        const handlers = this.handlers[event.name] || [];
        for (const handler of handlers) {
            await handler(event);
        }
    }
    clear() {
        this.handlers = {};
    }
}
exports.EventBus = EventBus;
exports.globalEventBus = new EventBus();
exports.default = exports.globalEventBus;
// CommonJS compatibility for code that uses require()
try {
    // @ts-ignore
    module.exports = exports.globalEventBus;
    // @ts-ignore
    module.exports.EventBus = EventBus;
}
catch (e) {
    // ignore in ESM environments
}
//# sourceMappingURL=EventBus.js.map