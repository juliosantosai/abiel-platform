// src/shared/errors/DomainError.test.js

const DomainError = require("./DomainError");

describe("DomainError", () => {

    test("debe crear un DomainError", () => {

        const error = new DomainError("Error");

        expect(error.message).toBe("Error");
        expect(error.name).toBe("DomainError");

    });

});