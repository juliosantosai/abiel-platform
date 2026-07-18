declare const DashboardMetrics: any;
declare const MetricasEmpresa: any;
declare const MetricasUsuario: any;
declare const MetricasConversacion: any;
declare const DashboardRepository: any;
declare const NotFoundError: any;
declare const prisma: any;
/**
 * Adaptador Prisma: PrismaDashboardRepository
 * Ejecuta queries agregadas para obtener métricas del dashboard
 */
declare class PrismaDashboardRepository extends DashboardRepository {
    /**
     * Obtiene métricas globales de una empresa
     */
    obtenerMetricasGlobales(empresaId: any): Promise<DashboardMetrics>;
    /**
     * Obtiene historial de actividades recientes
     */
    obtenerActividadReciente(empresaId: any, limit?: number): Promise<any[]>;
    /**
     * Helper: Agrupa resultados por estado para empresas
     */
    _agruparPorEstado(datos: any, campo: any): {
        total: number;
    };
    /**
     * Helper: Agrupa resultados por rol para usuarios
     */
    _agruparPorRol(datos: any, campo: any): {
        total: number;
    };
    /**
     * Helper: Agrupa resultados por estado para conversaciones
     */
    _agruparPorEstadoConversacion(datos: any, campo: any): {
        total: number;
    };
    /**
     * Helper: Obtiene actividad reciente simulada
     * TODO: Implementar con tabla de eventos una vez que se agregue a Prisma schema
     */
    _obtenerActividadRecienteInterna(empresaId: any, limit: any): Promise<any[]>;
    _countFromGroupBy(item: any): any;
    _mapearEstadoConversacion(estado: any): any;
}
//# sourceMappingURL=PrismaDashboardRepository.d.ts.map