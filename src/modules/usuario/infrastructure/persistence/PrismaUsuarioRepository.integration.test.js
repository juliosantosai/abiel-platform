jest.mock("../../../shared/database/prisma", () => ({
    usuario: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}), { virtual: true });

const prisma = require("../../../shared/database/prisma");
const PrismaUsuarioRepository = require("./PrismaUsuarioRepository");
const Usuario = require("../../domain/entities/Usuario");

describe("PrismaUsuarioRepository integration-style", () => {
    let repository;

    beforeEach(() => {
        repository = new PrismaUsuarioRepository();
        jest.clearAllMocks();
    });

    test("debe soportar el flujo completo de crear, buscar, actualizar y eliminar", async () => {
        const usuario = new Usuario({
            id: "usuario-int-1",
            empresaId: "empresa-int-1",
            nombre: "María López",
            email: "maria@empresa.com",
            rol: "ADMIN"
        });

        prisma.usuario.create.mockResolvedValue(usuario);
        prisma.usuario.findUnique.mockResolvedValue(usuario);
        prisma.usuario.update.mockResolvedValue(usuario);
        prisma.usuario.delete.mockResolvedValue(usuario);

        const creado = await repository.guardar(usuario);
        const encontrado = await repository.buscarPorId(usuario.id);
        usuario.activar();
        const actualizado = await repository.actualizar(usuario);
        const eliminado = await repository.eliminar(usuario.id);

        expect(creado).toBeInstanceOf(Usuario);
        expect(encontrado).toBeInstanceOf(Usuario);
        expect(actualizado.estado).toBe("ACTIVO");
        expect(eliminado).toBe(usuario);
    });
});
