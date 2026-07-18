export {};

const TenantGuard = require("./TenantGuard");
const TenantError = require("./TenantError");

describe("TenantGuard", () => {
    test("debe validar un contexto activo", () => {
        const guard = new TenantGuard();
        const context = guard.ensureTenantContext("tenant-1");

        expect(context.tenantId).toBe("tenant-1");
    });

    test("debe lanzar error cuando no hay contexto activo", () => {
        const guard = new TenantGuard();

        expect(() => guard.ensureTenantContext()).toThrow(TenantError);
        expect(() => guard.ensureTenantContext()).toThrow("No existe un contexto de tenant activo.");
    });

    test("debe aceptar recursos del mismo tenant", () => {
        const guard = new TenantGuard({ tenantContext: "tenant-3" });
        const result = guard.ensureSameTenant("tenant-3");

        expect(result.tenantId).toBe("tenant-3");
    });

    test("debe rechazar recursos de otro tenant", () => {
        const guard = new TenantGuard({ tenantContext: "tenant-3" });

        expect(() => guard.ensureSameTenant("tenant-4")).toThrow(TenantError);
    });

    test("debe inferir tenant desde un recurso", () => {
        const guard = new TenantGuard({ tenantContext: "tenant-5" });
        const result = guard.ensureTenantMatches({ empresaId: "tenant-5" });

        expect(result.tenantId).toBe("tenant-5");
    });
});
