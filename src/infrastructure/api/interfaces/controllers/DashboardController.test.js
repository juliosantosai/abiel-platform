const DashboardController = require("./DashboardController");
const DashboardMetrics = require("../../../../modules/dashboard/domain/entities/DashboardMetrics");

describe("DashboardController", () => {
    let controller;
    let mockObtenerMetricasUseCase;
    let mockObtenerActividadUseCase;

    beforeEach(() => {
        mockObtenerMetricasUseCase = { execute: jest.fn() };
        mockObtenerActividadUseCase = { execute: jest.fn() };

        controller = new DashboardController({
            obtenerMetricasGlobalesUseCase: mockObtenerMetricasUseCase,
            obtenerActividadRecienteUseCase: mockObtenerActividadUseCase,
        });
    });

    describe("obtenerMetricas()", () => {
        test("debe retornar 200 con métricas", async () => {
            const mockMetricas = DashboardMetrics.crear({
                empresaId: "empresa-123",
                empresasMetricas: { total: 1, ACTIVA: 1, SUSPENDIDA: 0, CANCELADA: 0, PENDIENTE: 0 },
                usuariosMetricas: { total: 5, ADMIN: 1, SUPERVISOR: 1, AGENTE: 2, CLIENTE: 1 },
                conversacionesMetricas: { total: 10, INICIADA: 5, EN_PROGRESO: 3, FINALIZADA: 2, BLOQUEADA: 0 },
            });

            mockObtenerMetricasUseCase.execute.mockResolvedValue(mockMetricas);

            const req = { tenantContext: { tenantId: "empresa-123" } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await controller.obtenerMetricas(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        empresaId: "empresa-123",
                    }),
                })
            );
        });

        test("debe retornar 401 si no hay tenantContext", async () => {
            const req = { tenantContext: null };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await expect(controller.obtenerMetricas(req, res)).rejects.toThrow("No se pudo determinar la empresa del usuario.");
        });

        test("debe llamar next(err) si hay error", async () => {
            const error = new Error("Test error");
            mockObtenerMetricasUseCase.execute.mockRejectedValue(error);

            const req = { tenantContext: { tenantId: "empresa-123" } };
            const res = {};
            const next = jest.fn();

            await controller.obtenerMetricas(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("obtenerActividad()", () => {
        test("debe retornar 200 con actividad", async () => {
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

            mockObtenerActividadUseCase.execute.mockResolvedValue(mockActividad);

            const req = {
                tenantContext: { tenantId: "empresa-123" },
                query: { limit: "20" },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await controller.obtenerActividad(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(mockObtenerActividadUseCase.execute).toHaveBeenCalledWith("empresa-123", 20);
        });

        test("debe usar limit default si no se proporciona", async () => {
            mockObtenerActividadUseCase.execute.mockResolvedValue([]);

            const req = {
                tenantContext: { tenantId: "empresa-123" },
                query: {},
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await controller.obtenerActividad(req, res);

            expect(mockObtenerActividadUseCase.execute).toHaveBeenCalledWith("empresa-123", 10);
        });

        test("debe retornar 401 si no hay tenantContext", async () => {
            const req = { tenantContext: null, query: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await expect(controller.obtenerActividad(req, res)).rejects.toThrow("No se pudo determinar la empresa del usuario.");
        });
    });
});
