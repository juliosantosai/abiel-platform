// src/shared/events/EventPublisher.js

const EventBus = require("./EventBus");
const Logger = require("../logger/Logger");
const UuidGenerator = require("../uuid/UuidGenerator");

const uuid = new UuidGenerator();

class EventPublisher {
    publish(eventOrName, data) {
        let event;

        if (typeof eventOrName === "string") {
            event = {
                id: uuid.generate(),
                name: eventOrName,
                data,
                occurredAt: new Date()
            };
        } else {
            event = eventOrName;
            if (!event || !event.name) {
                throw new Error("EventPublisher.publish requiere un evento con nombre.");
            }

            event.id = event.id || uuid.generate();
            event.occurredAt = event.occurredAt || new Date();
        }

        Logger.info(
            `Evento publicado: ${event.name}`,
            {
                eventId: event.id
            }
        );

        EventBus.publish(event);
    }
}

module.exports = new EventPublisher();