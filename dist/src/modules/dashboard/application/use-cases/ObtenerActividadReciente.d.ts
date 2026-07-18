declare const ValidationError: any;
/**
 * Use Case: ObtenerActividadReciente
 * Obtiene historial de actividades recientes de una empresa
 */
declare class ObtenerActividadReciente {
    constructor({ dashboardRepository }: {
        dashboardRepository: any;
    });
    /**
     * Ejecuta el caso de uso
     * @param {string} empresaId - ID de la empresa
     * @param {number} limit - Máximo de resultados (1-100, default 10)
     * @returns {Promise<Activity[]>} Actividades recientes
     */
    execute(empresaId: any, limit?: number): Promise<any>;
}
//# sourceMappingURL=ObtenerActividadReciente.d.ts.map