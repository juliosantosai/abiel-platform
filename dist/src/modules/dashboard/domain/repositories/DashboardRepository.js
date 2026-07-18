"use strict";
/**
 * Puerto (Contrato): DashboardRepository
 * Define operaciones para obtener datos agregados del dashboard
 *
 * Implementaciones:
 * - PrismaDashboardRepository (production)
 * - FakeDashboardRepository (tests)
 */
class DashboardRepository {
    /**
     * Obtiene métricas globales de una empresa
     * @param {string} empresaId - ID de la empresa
     * @returns {Promise<DashboardMetrics>} Métricas agregadas
     * @throws {NotFoundError} Si no hay datos para la empresa
     */
    async obtenerMetricasGlobales(empresaId) {
        throw new Error("obtenerMetricasGlobales() must be implemented");
    }
    /**
     * Obtiene historial de actividades recientes
     * @param {string} empresaId - ID de la empresa
     * @param {number} limit - Máximo de resultados (1-100)
     * @returns {Promise<Activity[]>} Actividades recientes
     * @throws {ValidationError} Si limit > 100
     */
    async obtenerActividadReciente(empresaId, limit = 10) {
        throw new Error("obtenerActividadReciente() must be implemented");
    }
}
module.exports = DashboardRepository;
//# sourceMappingURL=DashboardRepository.js.map