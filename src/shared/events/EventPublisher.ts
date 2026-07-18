module.exports = require("../../core/kernel/events/EventPublisher");// src/shared/events/EventPublisher.js

const { EventBus } = require("./EventBus");
const globalBus = require("./EventBus");
const Logger = require("../logger/Logger");

class EventPublisher {
    /**
     * @param {object} [opts]
     * @param {EventBus} [opts.bus] - bus a usar; si se omite usa el singleton global
     */
    constructor({ bus } = {}) {
        this.bus = bus || globalBus;
    }

    async publish(event) {
        if (!event || !event.name) {
            throw new Error("EventPublisher.publish requiere un evento con propiedad 'name'.");
        }

        Logger.info(`Evento publicado: ${event.name}`, { eventId: event.id });

        await this.bus.publish(event);
    }
}

// Singleton global para quienes no necesitan inyección
const globalPublisher = new EventPublisher();

module.exports = globalPublisher;
module.exports.EventPublisher = EventPublisher;
