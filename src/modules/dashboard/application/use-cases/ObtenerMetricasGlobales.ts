/**
 * Use Case: ObtenerMetricasGlobales
 * Obtiene métricas agregadas de una empresa
 */
class ObtenerMetricasGlobales {
    constructor({ dashboardRepository }) {
        this.dashboardRepository = dashboardRepository;
    }

    /**
     * Ejecuta el caso de uso
     * @param {string} empresaId - ID de la empresa
     * @returns {Promise<DashboardMetrics>} Métricas agregadas
     */
    async execute(empresaId) {
        if (!empresaId) {
            throw new Error("ObtenerMetricasGlobales: empresaId es requerido");
        }

        const metricas = await this.dashboardRepository.obtenerMetricasGlobales(empresaId);
        return metricas;
    }
}

module.exports = ObtenerMetricasGlobales;
