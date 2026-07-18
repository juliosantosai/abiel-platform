/**
 * Puerto (Contrato): DashboardRepository
 * Define operaciones para obtener datos agregados del dashboard
 *
 * Implementaciones:
 * - PrismaDashboardRepository (production)
 * - FakeDashboardRepository (tests)
 */
declare class DashboardRepository {
    /**
     * Obtiene métricas globales de una empresa
     * @param {string} empresaId - ID de la empresa
     * @returns {Promise<DashboardMetrics>} Métricas agregadas
     * @throws {NotFoundError} Si no hay datos para la empresa
     */
    obtenerMetricasGlobales(empresaId: any): Promise<void>;
    /**
     * Obtiene historial de actividades recientes
     * @param {string} empresaId - ID de la empresa
     * @param {number} limit - Máximo de resultados (1-100)
     * @returns {Promise<Activity[]>} Actividades recientes
     * @throws {ValidationError} Si limit > 100
     */
    obtenerActividadReciente(empresaId: any, limit?: number): Promise<void>;
}
//# sourceMappingURL=DashboardRepository.d.ts.map