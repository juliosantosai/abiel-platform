// src/shared/events/EventBus.js

class EventBus {

    constructor() {
        this.handlers = {};
    }


    subscribe(eventName, handler) {

        if(!this.handlers[eventName]){

            this.handlers[eventName] = [];

        }

        this.handlers[eventName].push(handler);

    }


    publish(event) {

        const handlers =
            this.handlers[event.name] || [];


        handlers.forEach(handler => {

            handler(event);

        });

    }

}


module.exports = new EventBus();