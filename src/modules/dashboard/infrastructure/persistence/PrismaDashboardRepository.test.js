jest.mock("../../../../shared/database/prisma", () => ({
    empresa: {
        groupBy: jest.fn(),
        findMany: jest.fn(),
    },
    usuario: {
        groupBy: jest.fn(),
        findMany: jest.fn(),
    },
    conversationSession: {
        groupBy: jest.fn(),
        findMany: jest.fn(),
    },
}));

const PrismaDashboardRepository = require("./PrismaDashboardRepository");
const prisma = require("../../../../shared/database/prisma");

describe("PrismaDashboardRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("obtenerMetricasGlobales()", () => {
        test("debe retornar DashboardMetrics con datos agregados", async () => {
            const empresaId = "empresa-123";

            // Mock groupBy para empresas
            prisma.empresa.groupBy = jest.fn().mockResolvedValue([
                { estado: "ACTIVA", _count: 1 },
            ]);

            // Mock groupBy para usuarios
            prisma.usuario.groupBy = jest.fn().mockResolvedValue([
                { rol: "ADMIN", _count: 1 },
                { rol: "AGENTE", _count: 4 },
            ]);

            // Mock groupBy para conversaciones
            prisma.conversationSession.groupBy = jest.fn().mockResolvedValue([
                { estado: "INICIADA", _count: 5 },
                { estado: "EN_PROGRESO", _count: 10 },
            ]);

            // Mock findMany para actividad reciente
            prisma.empresa.findMany = jest.fn().mockResolvedValue([
                {
                    id: empresaId,
                    nombre: "Empresa Test",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);

            prisma.usuario.findMany = jest.fn().mockResolvedValue([]);
            prisma.conversationSession.findMany = jest.fn().mockResolvedValue([]);

            const repository = new PrismaDashboardRepository();
            const resultado = await repository.obtenerMetricasGlobales(empresaId);

            expect(resultado.empresaId).toBe(empresaId);
            expect(resultado.empresasMetricas).toBeDefined();
            expect(resultado.usuariosMetricas).toBeDefined();
            expect(resultado.conversacionesMetricas).toBeDefined();
        });

        test("debe agrupar correctamente los datos de empresas", async () => {
            prisma.empresa.groupBy = jest.fn().mockResolvedValue([
                { estado: "ACTIVA", _count: 3 },
                { estado: "SUSPENDIDA", _count: 1 },
            ]);

            prisma.usuario.groupBy = jest.fn().mockResolvedValue([]);
            prisma.conversationSession.groupBy = jest.fn().mockResolvedValue([]);
            prisma.empresa.findMany = jest.fn().mockResolvedValue([]);
            prisma.usuario.findMany = jest.fn().mockResolvedValue([]);
            prisma.conversationSession.findMany = jest.fn().mockResolvedValue([]);

            const repository = new PrismaDashboardRepository();
            const resultado = await repository.obtenerMetricasGlobales("empresa-123");

            expect(resultado.empresasMetricas.ACTIVA).toBe(3);
            expect(resultado.empresasMetricas.SUSPENDIDA).toBe(1);
            expect(resultado.empresasMetricas.total).toBe(4);
        });
    });

    describe("obtenerActividadReciente()", () => {
        test("debe retornar array de actividades", async () => {
            prisma.empresa.findMany = jest.fn().mockResolvedValue([]);
            prisma.usuario.findMany = jest.fn().mockResolvedValue([]);
            prisma.conversationSession.findMany = jest.fn().mockResolvedValue([]);

            const repository = new PrismaDashboardRepository();
            const resultado = await repository.obtenerActividadReciente("empresa-123", 10);

            expect(Array.isArray(resultado)).toBe(true);
        });

        test("debe limitar resultados al parámetro limit", async () => {
            const mockUsuarios = Array(5)
                .fill(null)
                .map((_, i) => ({
                    id: `user-${i}`,
                    nombre: `Usuario ${i}`,
                    email: `user${i}@test.com`,
                    empresaId: "empresa-123",
                    rol: "AGENTE",
                    createdAt: new Date(),
                }));

            prisma.empresa.findMany = jest.fn().mockResolvedValue([]);
            prisma.usuario.findMany = jest.fn().mockResolvedValue(mockUsuarios);
            prisma.conversationSession.findMany = jest.fn().mockResolvedValue([]);

            const repository = new PrismaDashboardRepository();
            const resultado = await repository.obtenerActividadReciente("empresa-123", 3);

            expect(resultado.length).toBeLessThanOrEqual(3);
        });
    });
});
