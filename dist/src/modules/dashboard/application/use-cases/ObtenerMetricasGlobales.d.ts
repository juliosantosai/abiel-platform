/**
 * Use Case: ObtenerMetricasGlobales
 * Obtiene métricas agregadas de una empresa
 */
declare class ObtenerMetricasGlobales {
    constructor({ dashboardRepository }: {
        dashboardRepository: any;
    });
    /**
     * Ejecuta el caso de uso
     * @param {string} empresaId - ID de la empresa
     * @returns {Promise<DashboardMetrics>} Métricas agregadas
     */
    execute(empresaId: any): Promise<any>;
}
//# sourceMappingURL=ObtenerMetricasGlobales.d.ts.map