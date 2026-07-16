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

describe("PrismaUsuarioRepository", () => {
    let repository;

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
        repository = new PrismaUsuarioRepository();
    });

    test("guardar() debe llamar a prisma.usuario.upsert", async () => {
        const usuario = new Usuario({
            id: "usuario-20",
            empresaId: "empresa-1",
            nombre: "Carlos Pérez",
            email: "carlos@empresa.com",
            rol: "ADMIN"
        });

        prisma.usuario.upsert.mockResolvedValue(usuario);

        const result = await repository.guardar(usuario);

        expect(prisma.usuario.upsert).toHaveBeenCalledTimes(1);
        expect(prisma.usuario.upsert).toHaveBeenCalledWith({
            where: { id: usuario.id },
            update: {
                id: usuario.id,
                empresaId: usuario.empresaId,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado,
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt
            },
            create: {
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
