/**
 * Value Object: MetricasConversacion
 * Representa conteos de conversaciones por estado
 */
class MetricasConversacion {
    constructor({ total = 0, INICIADA = 0, EN_PROGRESO = 0, FINALIZADA = 0, BLOQUEADA = 0 } = {}) {
        this.validate({ total, INICIADA, EN_PROGRESO, FINALIZADA, BLOQUEADA });
        this.total = total;
        this.INICIADA = INICIADA;
        this.EN_PROGRESO = EN_PROGRESO;
        this.FINALIZADA = FINALIZADA;
        this.BLOQUEADA = BLOQUEADA;
    }

    validate(data) {
        const { total, INICIADA, EN_PROGRESO, FINALIZADA, BLOQUEADA } = data;
        if (typeof total !== "number" || total < 0) {
            throw new Error("MetricasConversacion: total debe ser número no negativo");
        }
        if (INICIADA + EN_PROGRESO + FINALIZADA + BLOQUEADA !== total) {
            throw new Error("MetricasConversacion: suma de estados debe igualar total");
        }
    }

    static desde(datos) {
        return new MetricasConversacion({
            total: datos.total || 0,
            INICIADA: datos.INICIADA || 0,
            EN_PROGRESO: datos.EN_PROGRESO || 0,
            FINALIZADA: datos.FINALIZADA || 0,
            BLOQUEADA: datos.BLOQUEADA || 0,
        });
    }

    toJSON() {
        return {
            total: this.total,
            INICIADA: this.INICIADA,
            EN_PROGRESO: this.EN_PROGRESO,
            FINALIZADA: this.FINALIZADA,
            BLOQUEADA: this.BLOQUEADA,
        };
    }
}

module.exports = MetricasConversacion;
