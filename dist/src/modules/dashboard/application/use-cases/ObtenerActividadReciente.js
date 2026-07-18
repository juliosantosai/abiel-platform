"use strict";
const ValidationError = require("../../../../shared/errors/ValidationError");
/**
 * Use Case: ObtenerActividadReciente
 * Obtiene historial de actividades recientes de una empresa
 */
class ObtenerActividadReciente {
    constructor({ dashboardRepository }) {
        this.dashboardRepository = dashboardRepository;
    }
    /**
     * Ejecuta el caso de uso
     * @param {string} empresaId - ID de la empresa
     * @param {number} limit - Máximo de resultados (1-100, default 10)
     * @returns {Promise<Activity[]>} Actividades recientes
     */
    async execute(empresaId, limit = 10) {
        if (!empresaId) {
            throw new Error("ObtenerActividadReciente: empresaId es requerido");
        }
        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            throw new ValidationError("limit debe ser un número entre 1 y 100", {
                limit: "Debe estar entre 1 y 100",
            });
        }
        const actividad = await this.dashboardRepository.obtenerActividadReciente(empresaId, limit);
        return actividad;
    }
}
module.exports = ObtenerActividadReciente;
//# sourceMappingURL=ObtenerActividadReciente.js.map