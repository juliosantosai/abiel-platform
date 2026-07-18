export {};

const FakeUsuarioRepository = require("./FakeUsuarioRepository");
const Usuario = require("../../domain/entities/Usuario");

describe("FakeUsuarioRepository", () => {
    let repository;

    beforeEach(() => {
        repository = new FakeUsuarioRepository();
    });

    test("guardar() debe almacenar y devolver el usuario", async () => {
        const usuario = new Usuario({
            id: "usuario-10",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        const result = await repository.guardar(usuario);

        expect(result).toBe(usuario);
        expect(await repository.buscarPorId("usuario-10")).toBe(usuario);
    });

    test("buscarPorId() debe devolver null cuando no existe", async () => {
        const result = await repository.buscarPorId("usuario-no-existe");
        expect(result).toBeNull();
    });

    test("actualizar() debe reemplazar el usuario existente", async () => {
        const usuario = new Usuario({
            id: "usuario-11",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        await repository.guardar(usuario);
        usuario.actualizarNombre("Carlos Actualizado");

        const updated = await repository.actualizar(usuario);

        expect(updated).toBe(usuario);
        expect((await repository.buscarPorId("usuario-11")).nombre).toBe("Carlos Actualizado");
    });

    test("actualizar() debe lanzar error cuando el usuario no existe", async () => {
        const usuario = new Usuario({
            id: "usuario-999",
            empresaId: "empresa-1",
            nombre: "Sin Registro",
            email: "sin@empresa.com",
            rol: "LECTOR"
        });

        await expect(repository.actualizar(usuario)).rejects.toThrow("Usuario con id usuario-999 no encontrado.");
    });
});
