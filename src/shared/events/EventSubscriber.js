// src/shared/events/EventSubscriber.js

const EventBus = require("./EventBus");


class EventSubscriber {


    subscribe(eventName, handler) {

        EventBus.subscribe(
            eventName,
            handler
        );

    }


}


module.exports = new EventSubscriber();