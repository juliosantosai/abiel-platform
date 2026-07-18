declare const uuidv4: any;
/**
 * Entidad: DashboardMetrics
 * Agregado raíz que contiene métricas agregadas de la empresa
 */
declare class DashboardMetrics {
    constructor({ id, empresaId, empresasMetricas, usuariosMetricas, conversacionesMetricas, actividadReciente, generadoEn, }: {
        id?: any;
        empresaId: any;
        empresasMetricas: any;
        usuariosMetricas: any;
        conversacionesMetricas: any;
        actividadReciente?: any[];
        generadoEn?: Date;
    });
    /**
     * Factory method: crea DashboardMetrics desde datos de BD
     */
    static crear({ id, empresaId, empresasMetricas, usuariosMetricas, conversacionesMetricas, actividadReciente, }: {
        id: any;
        empresaId: any;
        empresasMetricas: any;
        usuariosMetricas: any;
        conversacionesMetricas: any;
        actividadReciente: any;
    }): DashboardMetrics;
    /**
     * Convierte a JSON para respuesta HTTP
     */
    toJSON(): {
        id: any;
        empresaId: any;
        empresasMetricas: any;
        usuariosMetricas: any;
        conversacionesMetricas: any;
        actividadReciente: any;
        generadoEn: any;
    };
}
//# sourceMappingURL=DashboardMetrics.d.ts.map