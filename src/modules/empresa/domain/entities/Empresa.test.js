const Empresa = require("./Empresa");

describe("Empresa", () => {

    let empresa;

    beforeEach(() => {

        empresa = new Empresa({
            id: "empresa-001",
            nombre: "Mi Empresa"
        });

    });

    test("debe crear una empresa correctamente", () => {

        expect(empresa.id).toBe("empresa-001");
        expect(empresa.nombre).toBe("Mi Empresa");
        expect(empresa.estado).toBe("PENDIENTE");
        expect(empresa.plan).toBe("BASICO");

    });

    test("debe actualizar el nombre", () => {

        empresa.actualizarNombre("Empresa Nueva");

        expect(empresa.nombre).toBe("Empresa Nueva");

    });

    test("debe cambiar el plan", () => {

        empresa.cambiarPlan("PRO");

        expect(empresa.plan).toBe("PRO");

    });

    test("debe activar la empresa desde SUSPENDIDA", () => {

        empresa.activar();
        empresa.suspender();
        empresa.activar();

        expect(empresa.estado).toBe("ACTIVA");

    });

    test("debe suspender una empresa activa", () => {

        empresa.activar();
        empresa.suspender();

        expect(empresa.estado).toBe("SUSPENDIDA");

    });

    test("debe cancelar una empresa activa", () => {

        empresa.activar();
        empresa.cancelar();

        expect(empresa.estado).toBe("CANCELADA");

    });

    test("debe rechazar suspender una empresa pendiente", () => {

        expect(() => {
            empresa.suspender();
        }).toThrow("Una empresa pendiente no puede ser suspendida.");

    });

    test("debe eliminar la empresa", () => {

        empresa.eliminar();

        expect(empresa.estado).toBe("CANCELADA");

    });

    test("debe activar la empresa desde PENDIENTE", () => {

        empresa.activar();

        expect(empresa.estado).toBe("ACTIVA");

    });

    test("debe lanzar error si se intenta activar una empresa cancelada", () => {

        empresa.eliminar();

        expect(() => {
            empresa.activar();
        }).toThrow("Una empresa cancelada no puede volver a activarse.");

    });

    test("debe lanzar error si se intenta suspender una empresa cancelada", () => {

        empresa.eliminar();

        expect(() => {
            empresa.suspender();
        }).toThrow("Una empresa cancelada no puede ser suspendida.");

    });

    test("debe mantener el estado CANCELADA como final", () => {

        empresa.eliminar();
        empresa.cancelar();

        expect(empresa.estado).toBe("CANCELADA");

    });

    test("debe asignar una instancia de WhatsApp", () => {

        empresa.asignarWhatsappInstance("instance-001");

        expect(empresa.whatsappInstanceId)
            .toBe("instance-001");

    });

    test("debe quitar la instancia de WhatsApp", () => {

        empresa.asignarWhatsappInstance("instance-001");
        empresa.quitarWhatsappInstance();

        expect(empresa.whatsappInstanceId)
            .toBeNull();

    });

    test("debe lanzar error si el ID es vacío", () => {

        expect(() => {

            new Empresa({
                nombre: "Empresa"
            });

        }).toThrow();

    });

    test("debe lanzar error si el nombre es vacío", () => {

        expect(() => {

            new Empresa({
                id: "1",
                nombre: ""
            });

        }).toThrow();

    });

});