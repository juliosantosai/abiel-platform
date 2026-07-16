// src/shared/events/EventSubscriber.js
// Mantenido por compatibilidad. Usar EventBus directamente para nuevos módulos.

const globalBus = require("./EventBus");

class EventSubscriber {
    subscribe(eventName, handler) {
        globalBus.subscribe(eventName, handler);
    }

    unsubscribe(eventName, handler) {
        globalBus.unsubscribe(eventName, handler);
    }
}

module.exports = new EventSubscriber();
module.exports.EventSubscriber = EventSubscriber;
