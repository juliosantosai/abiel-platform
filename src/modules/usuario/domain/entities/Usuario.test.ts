export {};

const Usuario = require("./Usuario");
const NombreUsuario = require("../valueObjects/NombreUsuario");
const EmailUsuario = require("../valueObjects/EmailUsuario");
const RolUsuario = require("../valueObjects/RolUsuario");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");

const crearUsuario = (overrides = {}) => new Usuario({
    id: "usuario-001",
    empresaId: "empresa-001",
    nombre: "Juan Pérez",
    email: "juan@empresa.com",
    rol: "ADMIN",
    ...overrides
});

describe("Usuario", () => {
    test("debe crear un usuario correctamente", () => {
        const usuario = crearUsuario();

        expect(usuario.id).toBe("usuario-001");
        expect(usuario.empresaId).toBe("empresa-001");
        expect(usuario.nombre).toBe("Juan Pérez");
        expect(usuario.email).toBe("juan@empresa.com");
        expect(usuario.rol).toBe("ADMIN");
        expect(usuario.estado).toBe("PENDIENTE");
    });

    test("debe requerir empresaId", () => {
        expect(() => crearUsuario({ empresaId: undefined })).toThrow(ValidationError);
    });

    test("debe requerir nombre", () => {
        expect(() => crearUsuario({ nombre: "" })).toThrow(ValidationError);
    });

    test("debe requerir email", () => {
        expect(() => crearUsuario({ email: "" })).toThrow(ValidationError);
    });

    test("debe requerir rol", () => {
        expect(() => crearUsuario({ rol: "" })).toThrow(ValidationError);
    });
});

describe("NombreUsuario", () => {
    test("debe aceptar un nombre válido", () => {
        const nombre = new NombreUsuario("Ana Gómez");

        expect(nombre.value).toBe("Ana Gómez");
    });

    test("debe rechazar un nombre vacío", () => {
        expect(() => new NombreUsuario("   ")).toThrow(ValidationError);
    });

    test("debe rechazar un nombre demasiado corto", () => {
        expect(() => new NombreUsuario("J")).toThrow(ValidationError);
    });
});

describe("EmailUsuario", () => {
    test("debe aceptar un email válido", () => {
        const email = new EmailUsuario("Juan@Empresa.com");

        expect(email.value).toBe("juan@empresa.com");
    });

    test("debe rechazar un email inválido", () => {
        expect(() => new EmailUsuario("correo-invalido")).toThrow(ValidationError);
    });

    test("debe rechazar un email vacío", () => {
        expect(() => new EmailUsuario("   ")).toThrow(ValidationError);
    });
});

describe("RolUsuario", () => {
    test("debe aceptar OWNER", () => {
        const rol = new RolUsuario("OWNER");

        expect(rol.value).toBe("OWNER");
    });

    test("debe aceptar ADMIN", () => {
        const rol = new RolUsuario("ADMIN");

        expect(rol.value).toBe("ADMIN");
    });

    test("debe aceptar OPERADOR", () => {
        const rol = new RolUsuario("OPERADOR");

        expect(rol.value).toBe("OPERADOR");
    });

    test("debe aceptar LECTOR", () => {
        const rol = new RolUsuario("LECTOR");

        expect(rol.value).toBe("LECTOR");
    });

    test("debe rechazar un rol inválido", () => {
        expect(() => new RolUsuario("SUPERADMIN")).toThrow(ValidationError);
    });
});

describe("Transiciones de estado", () => {
    test("debe permitir PENDIENTE -> ACTIVO", () => {
        const usuario = crearUsuario();

        usuario.activar();

        expect(usuario.estado).toBe("ACTIVO");
    });

    test("debe permitir PENDIENTE -> CANCELADO", () => {
        const usuario = crearUsuario();

        usuario.cancelar();

        expect(usuario.estado).toBe("CANCELADO");
    });

    test("debe permitir ACTIVO -> SUSPENDIDO", () => {
        const usuario = crearUsuario();

        usuario.activar();
        usuario.suspender();

        expect(usuario.estado).toBe("SUSPENDIDO");
    });

    test("debe permitir ACTIVO -> CANCELADO", () => {
        const usuario = crearUsuario();

        usuario.activar();
        usuario.cancelar();

        expect(usuario.estado).toBe("CANCELADO");
    });

    test("debe permitir SUSPENDIDO -> ACTIVO", () => {
        const usuario = crearUsuario();

        usuario.activar();
        usuario.suspender();
        usuario.activar();

        expect(usuario.estado).toBe("ACTIVO");
    });

    test("debe permitir SUSPENDIDO -> CANCELADO", () => {
        const usuario = crearUsuario();

        usuario.activar();
        usuario.suspender();
        usuario.cancelar();

        expect(usuario.estado).toBe("CANCELADO");
    });

    test("debe mantener CANCELADO como estado final", () => {
        const usuario = crearUsuario();

        usuario.cancelar();
        usuario.cancelar();

        expect(usuario.estado).toBe("CANCELADO");
    });

    test("debe prohibir PENDIENTE -> SUSPENDIDO", () => {
        const usuario = crearUsuario();

        expect(() => usuario.suspender()).toThrow(DomainError);
    });

    test("debe prohibir CANCELADO -> ACTIVO", () => {
        const usuario = crearUsuario();

        usuario.cancelar();

        expect(() => usuario.activar()).toThrow(DomainError);
    });

    test("debe prohibir CANCELADO -> SUSPENDIDO", () => {
        const usuario = crearUsuario();

        usuario.cancelar();

        expect(() => usuario.suspender()).toThrow(DomainError);
    });
});
