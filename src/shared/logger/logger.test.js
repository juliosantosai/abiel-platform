// src/shared/logger/Logger.test.js

const Logger = require("./Logger");

describe("Logger", () => {

    test("info no debe lanzar errores", () => {

        expect(() => {

            Logger.info("hola");

        }).not.toThrow();

    });


    test("warn no debe lanzar errores", () => {

        expect(() => {

            Logger.warn("hola");

        }).not.toThrow();

    });


    test("error no debe lanzar errores", () => {

        expect(() => {

            Logger.error("hola");

        }).not.toThrow();

    });

});