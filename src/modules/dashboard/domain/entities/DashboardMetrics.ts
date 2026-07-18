const { v4: uuidv4 } = require("uuid");

/**
 * Entidad: DashboardMetrics
 * Agregado raíz que contiene métricas agregadas de la empresa
 */
class DashboardMetrics {
    constructor({
        id = uuidv4(),
        empresaId,
        empresasMetricas,
        usuariosMetricas,
        conversacionesMetricas,
        actividadReciente = [],
        generadoEn = new Date(),
    }) {
        this.id = id;
        this.empresaId = empresaId;
        this.empresasMetricas = empresasMetricas;
        this.usuariosMetricas = usuariosMetricas;
        this.conversacionesMetricas = conversacionesMetricas;
        this.actividadReciente = actividadReciente;
        this.generadoEn = generadoEn;
    }

    /**
     * Factory method: crea DashboardMetrics desde datos de BD
     */
    static crear({
        id,
        empresaId,
        empresasMetricas,
        usuariosMetricas,
        conversacionesMetricas,
        actividadReciente,
    }) {
        return new DashboardMetrics({
            id: id || uuidv4(),
            empresaId,
            empresasMetricas,
            usuariosMetricas,
            conversacionesMetricas,
            actividadReciente: actividadReciente || [],
            generadoEn: new Date(),
        });
    }

    /**
     * Convierte a JSON para respuesta HTTP
     */
    toJSON() {
        return {
            id: this.id,
            empresaId: this.empresaId,
            empresasMetricas: this.empresasMetricas,
            usuariosMetricas: this.usuariosMetricas,
            conversacionesMetricas: this.conversacionesMetricas,
            actividadReciente: this.actividadReciente,
            generadoEn: this.generadoEn,
        };
    }
}

module.exports = DashboardMetrics;
