// src/shared/events/EventSubscriber.test.js

const Subscriber = require("./EventSubscriber");
const Publisher = require("./EventPublisher");

describe("Subscriber", () => {

    test("debe escuchar eventos", () => {

        let recibido = false;

        Subscriber.subscribe(
            "EmpresaCreada",
            () => {

                recibido = true;

            }
        );

        Publisher.publish(
            "EmpresaCreada",
            {}
        );

        expect(recibido).toBe(true);

    });

});