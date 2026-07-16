// src/shared/uuid/UuidGenerator.test.js

const UuidGenerator = require("./UuidGenerator");

describe("UuidGenerator", () => {

    let uuidGenerator;

    beforeEach(() => {
        uuidGenerator = new UuidGenerator();
    });

    test("debe generar un UUID", () => {

        const id = uuidGenerator.generate();

        expect(id).toBeDefined();
        expect(typeof id).toBe("string");

    });

    test("debe generar UUIDs diferentes", () => {

        const id1 = uuidGenerator.generate();
        const id2 = uuidGenerator.generate();

        expect(id1).not.toBe(id2);

    });

    test("debe generar un UUID con formato válido", () => {

        const id = uuidGenerator.generate();

        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        expect(uuidRegex.test(id)).toBe(true);

    });

});