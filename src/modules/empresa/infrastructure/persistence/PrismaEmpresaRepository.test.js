jest.mock("../../../shared/database/prisma", () => ({
    empresa: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
    }
}), { virtual: true });

const prisma = require("../../../shared/database/prisma");
const PrismaEmpresaRepository = require("./PrismaEmpresaRepository");
const Empresa = require("../../domain/entities/Empresa");

describe("PrismaEmpresaRepository", () => {
    let repository;

    beforeEach(() => {
        repository = new PrismaEmpresaRepository();
        prisma.empresa.create.mockReset();
        prisma.empresa.findUnique.mockReset();
        prisma.empresa.update.mockReset();
    });

    test("guardar() debe llamar a prisma.empresa.create con los datos correctos", async () => {
        const empresa = new Empresa({
            id: "empresa-20",
            nombre: "Empresa Veinte"
        });

        prisma.empresa.create.mockResolvedValue(empresa);

        const result = await repository.guardar(empresa);

        expect(prisma.empresa.create).toHaveBeenCalledTimes(1);
        expect(prisma.empresa.create).toHaveBeenCalledWith({
            data: {
                id: empresa.id,
                nombre: empresa.nombre,
                email: empresa.email,
                telefono: empresa.telefono,
                whatsappInstanceId: empresa.whatsappInstanceId,
                estado: empresa.estado,
                plan: empresa.plan,
                createdAt: empresa.createdAt,
                updatedAt: empresa.updatedAt
            }
        });

        expect(result).toBe(empresa);
    });

    test("buscarPorId() debe mapear el registro Prisma a la entidad Empresa", async () => {
        const record = {
            id: "empresa-21",
            nombre: "Empresa Veintiuno",
            email: null,
            telefono: null,
            whatsappInstanceId: null,
            estado: "PENDIENTE",
            plan: "BASICO",
            createdAt: new Date("2026-01-01T00:00:00Z"),
            updatedAt: new Date("2026-01-01T00:00:00Z")
        };

        prisma.empresa.findUnique.mockResolvedValue(record);

        const result = await repository.buscarPorId("empresa-21");

        expect(prisma.empresa.findUnique).toHaveBeenCalledWith({ where: { id: "empresa-21" } });
        expect(result).toBeInstanceOf(Empresa);
        expect(result.id).toBe(record.id);
        expect(result.nombre).toBe(record.nombre);
        expect(result.estado).toBe(record.estado);
        expect(result.plan).toBe(record.plan);
    });

    test("buscarPorId() debe devolver null cuando prisma no retorna un registro", async () => {
        prisma.empresa.findUnique.mockResolvedValue(null);

        const result = await repository.buscarPorId("empresa-no-existe");

        expect(prisma.empresa.findUnique).toHaveBeenCalledWith({ where: { id: "empresa-no-existe" } });
        expect(result).toBeNull();
    });

    test("actualizar() debe llamar a prisma.empresa.update con los datos correctos", async () => {
        const empresa = new Empresa({
            id: "empresa-22",
            nombre: "Empresa Veintidos"
        });

        empresa.actualizarNombre("Empresa 22 Actualizada");
        prisma.empresa.update.mockResolvedValue(empresa);

        const result = await repository.actualizar(empresa);

        expect(prisma.empresa.update).toHaveBeenCalledWith({
            where: { id: empresa.id },
            data: {
                nombre: empresa.nombre,
                email: empresa.email,
                telefono: empresa.telefono,
                whatsappInstanceId: empresa.whatsappInstanceId,
                estado: empresa.estado,
                plan: empresa.plan,
                updatedAt: empresa.updatedAt
            }
        });
        expect(result).toBe(empresa);
    });
});
