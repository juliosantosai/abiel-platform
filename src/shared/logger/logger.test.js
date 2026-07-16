const { Logger } = require("./Logger");

describe("Logger", () => {
    test("no lanza errores al llamar info, error y warn", () => {
        const logger = new Logger({ silent: true });
        expect(() => logger.info("mensaje")).not.toThrow();
        expect(() => logger.error("error")).not.toThrow();
        expect(() => logger.warn("advertencia")).not.toThrow();
    });

    test("el singleton por defecto es silencioso en NODE_ENV=test", () => {
        const singleton = require("./Logger");
        // Si NODE_ENV=test (como en Jest), silent debe ser true
        expect(singleton.silent).toBe(true);
    });
});
