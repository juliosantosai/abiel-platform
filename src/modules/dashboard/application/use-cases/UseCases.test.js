const ObtenerMetricasGlobales = require("./ObtenerMetricasGlobales");
const ObtenerActividadReciente = require("./ObtenerActividadReciente");
const DashboardMetrics = require("../../domain/entities/DashboardMetrics");
const ValidationError = require("../../../../shared/errors/ValidationError");

describe("Dashboard Use Cases", () => {
    describe("ObtenerMetricasGlobales", () => {
        let useCase;
        let mockRepository;

        beforeEach(() => {
            mockRepository = {
                obtenerMetricasGlobales: jest.fn(),
            };
            useCase = new ObtenerMetricasGlobales({ dashboardRepository: mockRepository });
        });

        test("debe ejecutar exitosamente", async () => {
            const mockMetricas = DashboardMetrics.crear({
                empresaId: "empresa-123",
                empresasMetricas: { total: 1, ACTIVA: 1, SUSPENDIDA: 0, CANCELADA: 0, PENDIENTE: 0 },
                usuariosMetricas: { total: 5, ADMIN: 1, SUPERVISOR: 1, AGENTE: 2, CLIENTE: 1 },
                conversacionesMetricas: { total: 10, INICIADA: 5, EN_PROGRESO: 3, FINALIZADA: 2, BLOQUEADA: 0 },
                actividadReciente: [],
            });

            mockRepository.obtenerMetricasGlobales.mockResolvedValue(mockMetricas);

            const resultado = await useCase.execute("empresa-123");

            expect(mockRepository.obtenerMetricasGlobales).toHaveBeenCalledWith("empresa-123");
            expect(resultado.empresaId).toBe("empresa-123");
        });

        test("debe lanzar error si empresaId no se proporciona", async () => {
            await expect(useCase.execute(null)).rejects.toThrow("empresaId es requerido");
        });
    });

    describe("ObtenerActividadReciente", () => {
        let useCase;
        let mockRepository;

        beforeEach(() => {
            mockRepository = {
                obtenerActividadReciente: jest.fn(),
            };
            useCase = new ObtenerActividadReciente({ dashboardRepository: mockRepository });
        });

        test("debe ejecutar exitosamente con limit default", async () => {
            const mockActividad = [
                {
                    id: "evt-1",
                    tipo: "UsuarioCreado",
                    empresaId: "empresa-123",
                    usuario: "admin@empresa.com",
                    datos: { nombre: "Admin" },
                    timestamp: new Date(),
                },
            ];

            mockRepository.obtenerActividadReciente.mockResolvedValue(mockActividad);

            const resultado = await useCase.execute("empresa-123");

            expect(mockRepository.obtenerActividadReciente).toHaveBeenCalledWith("empresa-123", 10);
            expect(resultado.length).toBe(1);
        });

        test("debe validar limit máximo (100)", async () => {
            await expect(useCase.execute("empresa-123", 101)).rejects.toThrow(ValidationError);
        });

        test("debe validar limit mínimo (1)", async () => {
            await expect(useCase.execute("empresa-123", 0)).rejects.toThrow(ValidationError);
        });

        test("debe aceptar limit dentro del rango válido", async () => {
            mockRepository.obtenerActividadReciente.mockResolvedValue([]);

            await useCase.execute("empresa-123", 50);

            expect(mockRepository.obtenerActividadReciente).toHaveBeenCalledWith("empresa-123", 50);
        });

        test("debe lanzar error si empresaId no se proporciona", async () => {
            await expect(useCase.execute(null, 10)).rejects.toThrow("empresaId es requerido");
        });
    });
});
