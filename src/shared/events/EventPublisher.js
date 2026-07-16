// src/shared/events/EventPublisher.js

const EventBus = require("./EventBus");
const Logger = require("../logger/Logger");
const UuidGenerator = require("../uuid/UuidGenerator");

const uuid = new UuidGenerator();

class EventPublisher {


    publish(name, data) {


        const event = {

            id:  uuid.generate(),

            name,

            data,

            occurredAt: new Date()

        };


        Logger.info(
            `Evento publicado: ${name}`,
            {
                eventId: event.id
            }
        );


        EventBus.publish(event);

    }
}

module.exports = new EventPublisher();