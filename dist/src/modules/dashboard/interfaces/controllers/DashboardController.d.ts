declare class DashboardController {
    constructor({ obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase }: {
        obtenerMetricasGlobalesUseCase: any;
        obtenerActividadRecienteUseCase: any;
    });
    /**
     * GET /api/dashboard/metricas
     * Retorna métricas globales de la empresa autenticada
     */
    obtenerMetricas(req: any, res: any, next: any): Promise<any>;
    /**
     * GET /api/dashboard/actividad?limit=20
     * Retorna historial de actividades recientes
     */
    obtenerActividad(req: any, res: any, next: any): Promise<any>;
}
//# sourceMappingURL=DashboardController.d.ts.map