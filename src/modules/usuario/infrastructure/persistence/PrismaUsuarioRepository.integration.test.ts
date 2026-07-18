export {};

jest.mock("../../../../shared/database/prisma", () => ({
    usuario: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
}));

const prisma = require("../../../../shared/database/prisma");
const PrismaUsuarioRepository = require("./PrismaUsuarioRepository");
const Usuario = require("../../domain/entities/Usuario");

describe("PrismaUsuarioRepository integration-style", () => {
    let repository;

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
        repository = new PrismaUsuarioRepository();
    });

    test("debe soportar el flujo completo de crear, buscar, actualizar y eliminar", async () => {
        const usuarioData = {
            id: "usuario-int-1",
            empresaId: "empresa-int-1",
            nombre: "María López",
            email: "maria@empresa.com",
            rol: "ADMIN",
            estado: "PENDIENTE",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        prisma.usuario.upsert.mockResolvedValue(usuarioData);
        prisma.usuario.findUnique.mockResolvedValue(usuarioData);
        prisma.usuario.update.mockResolvedValue({ ...usuarioData, estado: "ACTIVO" });
        prisma.usuario.delete.mockResolvedValue(usuarioData);

        const creado = await repository.guardar(new Usuario(usuarioData));
        const encontrado = await repository.buscarPorId(usuarioData.id);
        
        const usuarioParaActualizar = new Usuario(usuarioData);
        usuarioParaActualizar.activar();
        const actualizado = await repository.actualizar(usuarioParaActualizar);
        const eliminado = await repository.eliminar(usuarioData.id);

        expect(creado).toBeDefined();
        expect(encontrado).toBeInstanceOf(Usuario);
        expect(actualizado.estado).toBe("ACTIVO");
        expect(eliminado).toBeDefined();
    });
});
