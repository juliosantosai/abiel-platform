export {};

// src/shared/errors/ValidationError.test.js

const ValidationError = require("./ValidationError");

describe("ValidationError", () => {

    test("debe guardar los campos inválidos", () => {

        const error = new ValidationError(
            "Datos inválidos",
            {
                nombre: "obligatorio"
            }
        );

        expect(error.fields.nombre)
            .toBe("obligatorio");

    });

});