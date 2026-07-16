// src/shared/events/EventPublisher.test.js

const EventPublisher = require("./EventPublisher");
const EventBus = require("./EventBus");

describe("EventPublisher", () => {

    test("debe publicar un evento", () => {

        let recibido = false;

        EventBus.subscribe(
            "EmpresaCreada",
            () => {
                recibido = true;
            }
        );

        EventPublisher.publish(
            "EmpresaCreada",
            {
                empresaId: "1"
            }
        );

        expect(recibido).toBe(true);

    });

});