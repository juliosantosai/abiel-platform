export {};

// src/shared/errors/NotFoundError.test.js

const NotFoundError = require("./NotFoundError");

describe("NotFoundError", () => {

    test("debe guardar recurso e id", () => {

        const error = new NotFoundError(
            "Empresa",
            "123"
        );

        expect(error.resource).toBe("Empresa");
        expect(error.id).toBe("123");

    });

});