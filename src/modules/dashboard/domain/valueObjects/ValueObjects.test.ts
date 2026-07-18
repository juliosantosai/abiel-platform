export {};

const MetricasEmpresa = require("./MetricasEmpresa");
const MetricasUsuario = require("./MetricasUsuario");
const MetricasConversacion = require("./MetricasConversacion");

describe("Dashboard Value Objects", () => {
    describe("MetricasEmpresa", () => {
        test("debe crear con valores válidos", () => {
            const metricas = new MetricasEmpresa({
                total: 5,
                ACTIVA: 3,
                SUSPENDIDA: 1,
                CANCELADA: 1,
                PENDIENTE: 0,
            });

            expect(metricas.total).toBe(5);
            expect(metricas.ACTIVA).toBe(3);
        });

        test("debe lanzar error si la suma de estados no iguala total", () => {
            expect(() => {
                new MetricasEmpresa({
                    total: 5,
                    ACTIVA: 2,
                    SUSPENDIDA: 1,
                    CANCELADA: 1,
                    PENDIENTE: 0,
                });
            }).toThrow("suma de estados debe igualar total");
        });

        test("debe crear desde factory method desde()", () => {
            const metricas = MetricasEmpresa.desde({
                total: 3,
                ACTIVA: 2,
                SUSPENDIDA: 1,
                CANCELADA: 0,
                PENDIENTE: 0,
            });

            expect(metricas.total).toBe(3);
            expect(metricas.ACTIVA).toBe(2);
        });

        test("debe convertir a JSON", () => {
            const metricas = new MetricasEmpresa({
                total: 2,
                ACTIVA: 1,
                SUSPENDIDA: 1,
                CANCELADA: 0,
                PENDIENTE: 0,
            });

            const json = metricas.toJSON();
            expect(json.total).toBe(2);
            expect(json.ACTIVA).toBe(1);
        });
    });

    describe("MetricasUsuario", () => {
        test("debe crear con valores válidos", () => {
            const metricas = new MetricasUsuario({
                total: 10,
                ADMIN: 1,
                SUPERVISOR: 2,
                AGENTE: 5,
                CLIENTE: 2,
            });

            expect(metricas.total).toBe(10);
            expect(metricas.ADMIN).toBe(1);
        });

        test("debe lanzar error si la suma de roles no iguala total", () => {
            expect(() => {
                new MetricasUsuario({
                    total: 10,
                    ADMIN: 1,
                    SUPERVISOR: 1,
                    AGENTE: 5,
                    CLIENTE: 1,
                });
            }).toThrow("suma de roles debe igualar total");
        });

        test("debe convertir a JSON", () => {
            const metricas = new MetricasUsuario({
                total: 5,
                ADMIN: 1,
                SUPERVISOR: 1,
                AGENTE: 2,
                CLIENTE: 1,
            });

            const json = metricas.toJSON();
            expect(json.ADMIN).toBe(1);
        });
    });

    describe("MetricasConversacion", () => {
        test("debe crear con valores válidos", () => {
            const metricas = new MetricasConversacion({
                total: 100,
                INICIADA: 30,
                EN_PROGRESO: 50,
                FINALIZADA: 15,
                BLOQUEADA: 5,
            });

            expect(metricas.total).toBe(100);
            expect(metricas.EN_PROGRESO).toBe(50);
        });

        test("debe lanzar error si la suma de estados no iguala total", () => {
            expect(() => {
                new MetricasConversacion({
                    total: 100,
                    INICIADA: 30,
                    EN_PROGRESO: 50,
                    FINALIZADA: 15,
                    BLOQUEADA: 4,
                });
            }).toThrow("suma de estados debe igualar total");
        });

        test("debe convertir a JSON", () => {
            const metricas = new MetricasConversacion({
                total: 50,
                INICIADA: 10,
                EN_PROGRESO: 30,
                FINALIZADA: 8,
                BLOQUEADA: 2,
            });

            const json = metricas.toJSON();
            expect(json.EN_PROGRESO).toBe(30);
        });
    });
});
