"use strict";
module.exports = require("../../../../infrastructure/api/interfaces/controllers/DashboardController"); /**
 * Controller: DashboardController
 * Maneja endpoints del dashboard
 */
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
            // Obtener empresaId del token JWT (via TenantContext)
            const empresaId = req.tenantContext?.tenantId;
            if (!empresaId) {
                return res.status(401).json({
                    success: false,
                    error: "No se pudo determinar la empresa del usuario.",
                });
            }
            const metricas = await this.obtenerMetricasGlobalesUseCase.execute(empresaId);
            return res.status(200).json({
                success: true,
                data: metricas.toJSON(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    /**
     * GET /api/dashboard/actividad?limit=20
     * Retorna historial de actividades recientes
     */
    async obtenerActividad(req, res, next) {
        try {
            const empresaId = req.tenantContext?.tenantId;
            if (!empresaId) {
                return res.status(401).json({
                    success: false,
                    error: "No se pudo determinar la empresa del usuario.",
                });
            }
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const actividad = await this.obtenerActividadRecienteUseCase.execute(empresaId, limit);
            return res.status(200).json({
                success: true,
                data: actividad,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
module.exports = DashboardController;
//# sourceMappingURL=DashboardController.js.map