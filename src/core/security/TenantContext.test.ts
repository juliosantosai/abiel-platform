export {};

const TenantContext = require("./TenantContext");

describe("TenantContext", () => {
    test("debe construir un contexto desde un string", () => {
        const context = TenantContext.from("tenant-1");

        expect(context).toBeInstanceOf(TenantContext);
        expect(context.tenantId).toBe("tenant-1");
        expect(context.source).toBe("string");
    });

    test("debe aceptar un objeto con tenantId", () => {
        const context = TenantContext.from({ tenantId: "tenant-2", source: "request" });

        expect(context.tenantId).toBe("tenant-2");
        expect(context.source).toBe("request");
    });

    test("debe rechazar un tenantId vacío", () => {
        expect(() => new TenantContext({ tenantId: "" })).toThrow("El tenantId es obligatorio.");
    });
});
