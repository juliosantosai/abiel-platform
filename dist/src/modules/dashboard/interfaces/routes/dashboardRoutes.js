"use strict";
module.exports = require("../../../../infrastructure/api/interfaces/routes/dashboardRoutes"); /**
 * Rutas del módulo Dashboard
 */
function crearRutasDashboard(dashboardController) {
    const express = require("express");
    const router = express.Router();
    /**
     * GET /api/dashboard/metricas
     * Obtener métricas globales
     */
    router.get("/metricas", (req, res, next) => dashboardController.obtenerMetricas(req, res, next));
    /**
     * GET /api/dashboard/actividad
     * Obtener historial de actividades
     */
    router.get("/actividad", (req, res, next) => dashboardController.obtenerActividad(req, res, next));
    return router;
}
module.exports = { crearRutasDashboard };
//# sourceMappingURL=dashboardRoutes.js.map