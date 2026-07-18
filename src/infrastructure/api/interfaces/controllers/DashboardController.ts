/**
 * Controller: DashboardController
 * Maneja endpoints del dashboard
 */
const { ApiResponse } = require("../../contracts");
const { validateDashboardTenant, validateDashboardLimit } = require("../../validators/dashboardValidators");
const { toDashboardMetricsDto, toDashboardActivityDto } = require("../../mappers/dashboardHttpMapper");

class DashboardController {
    constructor({ obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase }) {
        this.obtenerMetricasGlobalesUseCase = obtenerMetricasGlobalesUseCase;
        this.obtenerActividadRecienteUseCase = obtenerActividadRecienteUseCase;
    }

    /**
     * GET /api/dashboard/metricas
     * Retorna métricas globales de la empresa autenticada
     */
    async obtenerMetricas(req, res, next) {
        try {
            const empresaId = validateDashboardTenant(req);

            const metricas = await this.obtenerMetricasGlobalesUseCase.execute(empresaId);
            return res.status(200).json(ApiResponse.ok({ req, data: toDashboardMetricsDto(metricas) }));
        } catch (err) {
            if (typeof next === "function") {
                return next(err);
            }
            throw err;
        }
    }

    /**
     * GET /api/dashboard/actividad?limit=20
     * Retorna historial de actividades recientes
     */
    async obtenerActividad(req, res, next) {
        try {
            const empresaId = validateDashboardTenant(req);
            const limit = validateDashboardLimit(req.query);

            const actividad = await this.obtenerActividadRecienteUseCase.execute(empresaId, limit);
            return res.status(200).json(ApiResponse.ok({ req, data: toDashboardActivityDto(actividad) }));
        } catch (err) {
            if (typeof next === "function") {
                return next(err);
            }
            throw err;
        }
    }
}

module.exports = DashboardController;
