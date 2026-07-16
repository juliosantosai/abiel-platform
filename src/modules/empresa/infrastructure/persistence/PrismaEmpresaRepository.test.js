jest.mock("../../../../shared/database/prisma", () => ({
    empresa: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn()
    }
}));

const prisma = require("../../../../shared/database/prisma");
const PrismaEmpresaRepository = require("./PrismaEmpresaRepository");
const Empresa = require("../../domain/entities/Empresa");

describe("PrismaEmpresaRepository", () => {
    let repository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new PrismaEmpresaRepository();
    });

    test("guardar() debe llamar a prisma.empresa.upsert", async () => {
        const empresa = new Empresa({
            id: "empresa-20",
            nombre: "Empresa Veinte"
        });

        prisma.empresa.upsert.mockResolvedValue(empresa);

        const result = await repository.guardar(empresa);

        expect(prisma.empresa.upsert).toHaveBeenCalledTimes(1);
        expect(result).toBe(empresa);
    });

    test("buscarPorId() debe mapear el registro a Empresa", async () => {
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
    });

    test("buscarPorId() debe devolver null cuando prisma no retorna", async () => {
        prisma.empresa.findUnique.mockResolvedValue(null);

        const result = await repository.buscarPorId("empresa-no-existe");

        expect(result).toBeNull();
    });

    test("obtenerTodas() debe retornar lista de empresas", async () => {
        const records = [
            { id: "e1", nombre: "Emp 1", estado: "ACTIVA", plan: "PRO" },
            { id: "e2", nombre: "Emp 2", estado: "SUSPENDIDA", plan: "BASICO" }
        ];

        prisma.empresa.findMany.mockResolvedValue(records);

        const result = await repository.obtenerTodas();

        expect(prisma.empresa.findMany).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result.every(e => e instanceof Empresa)).toBe(true);
    });

    test("actualizar() debe llamar a prisma.empresa.update", async () => {
        const empresa = new Empresa({
            id: "empresa-22",
            nombre: "Empresa Actualizada"
        });

        prisma.empresa.update.mockResolvedValue(empresa);

        const result = await repository.actualizar(empresa);

        expect(prisma.empresa.update).toHaveBeenCalledWith({
            where: { id: empresa.id },
            data: expect.objectContaining({ nombre: empresa.nombre })
        });
        expect(result).toBe(empresa);
    });
});
