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

describe("PrismaUsuarioRepository", () => {
    let repository;

    beforeEach(() => {
        repository = new PrismaUsuarioRepository();
        prisma.usuario.create.mockReset();
        prisma.usuario.findUnique.mockReset();
        prisma.usuario.findFirst.mockReset();
        prisma.usuario.findMany.mockReset();
        prisma.usuario.update.mockReset();
        prisma.usuario.delete.mockReset();
    });

    test("guardar() debe llamar a prisma.usuario.create con los datos correctos", async () => {
        const usuario = new Usuario({
            id: "usuario-20",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        prisma.usuario.create.mockResolvedValue(usuario);

        const result = await repository.guardar(usuario);

        expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
        expect(prisma.usuario.create).toHaveBeenCalledWith({
            data: {
                id: usuario.id,
                empresaId: usuario.empresaId,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado,
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt
            }
        });

        expect(result).toBe(usuario);
    });

    test("buscarPorId() debe mapear el registro Prisma a la entidad Usuario", async () => {
        const record = {
            id: "usuario-21",
            empresaId: "empresa-1",
            nombre: "Ana Gómez",
            email: "ana@empresa.com",
            rol: "LECTOR",
            estado: "PENDIENTE",
            createdAt: new Date("2026-01-01T00:00:00Z"),
            updatedAt: new Date("2026-01-01T00:00:00Z")
        };

        prisma.usuario.findUnique.mockResolvedValue(record);

        const result = await repository.buscarPorId("usuario-21");

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { id: "usuario-21" } });
        expect(result).toBeInstanceOf(Usuario);
        expect(result.id).toBe(record.id);
        expect(result.empresaId).toBe(record.empresaId);
        expect(result.nombre).toBe(record.nombre);
        expect(result.estado).toBe(record.estado);
    });

    test("buscarPorId() debe devolver null cuando prisma no retorna un registro", async () => {
        prisma.usuario.findUnique.mockResolvedValue(null);

        const result = await repository.buscarPorId("usuario-no-existe");

        expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { id: "usuario-no-existe" } });
        expect(result).toBeNull();
    });

    test("actualizar() debe llamar a prisma.usuario.update con los datos correctos", async () => {
        const usuario = new Usuario({
            id: "usuario-22",
            empresaId: "empresa-1",
            nombre: "Luis Ruiz",
            email: "luis@empresa.com",
            rol: "OPERADOR"
        });

        usuario.activar();
        prisma.usuario.update.mockResolvedValue(usuario);

        const result = await repository.actualizar(usuario);

        expect(prisma.usuario.update).toHaveBeenCalledWith({
            where: { id: usuario.id },
            data: {
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado,
                updatedAt: usuario.updatedAt
            }
        });
        expect(result).toBe(usuario);
    });
});
