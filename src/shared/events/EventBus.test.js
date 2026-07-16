// src/shared/events/EventBus.test.js

const EventBus = require("./EventBus");

describe("EventBus", () => {

    test("debe publicar un evento", () => {

        let recibido = false;

        EventBus.subscribe(
            "EmpresaCreada",
            () => {
                recibido = true;
            }
        );

        EventBus.publish({
            name: "EmpresaCreada"
        });

        expect(recibido).toBe(true);

    });

});