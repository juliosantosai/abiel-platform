"use strict";
const RuntimeBootstrap = require("../../../bootstrap/RuntimeBootstrap");
const PrismaDashboardRepository = require("../../../modules/dashboard/infrastructure/persistence/PrismaDashboardRepository");
const ObtenerMetricasGlobales = require("../../../modules/dashboard/application/use-cases/ObtenerMetricasGlobales");
const ObtenerActividadReciente = require("../../../modules/dashboard/application/use-cases/ObtenerActividadReciente");
function buildMockUseCases() {
    const ok = async (payload = {}) => ({ ok: true, ...payload });
    const dashboardRepository = new PrismaDashboardRepository();
    return {
        crearEmpresaUseCase: { execute: () => ok({ resource: "empresa" }) },
        actualizarEmpresaUseCase: { execute: () => ok({ resource: "empresa" }) },
        activarEmpresaUseCase: { execute: () => ok({ resource: "empresa", estado: "ACTIVA" }) },
        suspenderEmpresaUseCase: { execute: () => ok({ resource: "empresa", estado: "SUSPENDIDA" }) },
        cancelarEmpresaUseCase: { execute: () => ok({ resource: "empresa", estado: "CANCELADA" }) },
        crearUsuarioUseCase: { execute: () => ok({ resource: "usuario" }) },
        actualizarUsuarioUseCase: { execute: () => ok({ resource: "usuario" }) },
        activarUsuarioUseCase: { execute: () => ok({ resource: "usuario", estado: "ACTIVO" }) },
        suspenderUsuarioUseCase: { execute: () => ok({ resource: "usuario", estado: "SUSPENDIDO" }) },
        cancelarUsuarioUseCase: { execute: () => ok({ resource: "usuario", estado: "CANCELADO" }) },
        bloquearConversacionUseCase: { execute: () => ok({ control: "HUMAN_LOCKED" }) },
        cerrarConversacionUseCase: { execute: () => ok({ control: "CLOSED" }) },
        obtenerMetricasGlobalesUseCase: new ObtenerMetricasGlobales({ dashboardRepository }),
        obtenerActividadRecienteUseCase: new ObtenerActividadReciente({ dashboardRepository }),
    };
}
function run() {
    const port = Number(process.env.PORT || 5000);
    const loadPlugins = false;
    const httpEnabled = true;
    if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = "dev-secret";
    }
    RuntimeBootstrap.create({
        tenantId: process.env.TENANT_ID,
        runtimeEnv: process.env.NODE_ENV,
        apiPort: port,
        loadPlugins,
        useCases: buildMockUseCases(),
        startApi: httpEnabled,
    });
}
if (require.main === module) {
    run();
}
module.exports = { run };
//# sourceMappingURL=runApiMock.js.map