"use strict";
// src/shared/events/EventBus.js
class EventBus {
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
        this.handlers[eventName] = this.handlers[eventName].filter(h => h !== handler);
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
// Clase exportada para inyección de dependencias
// El singleton global se mantiene para compatibilidad
const globalBus = new EventBus();
module.exports = globalBus;
module.exports.EventBus = EventBus;
//# sourceMappingURL=EventBus.js.map