/**
 * Value Object: MetricasEmpresa
 * Representa conteos de empresas por estado
 */
class MetricasEmpresa {
    constructor({ total = 0, ACTIVA = 0, SUSPENDIDA = 0, CANCELADA = 0, PENDIENTE = 0 }) {
        this.validate({ total, ACTIVA, SUSPENDIDA, CANCELADA, PENDIENTE });
        this.total = total;
        this.ACTIVA = ACTIVA;
        this.SUSPENDIDA = SUSPENDIDA;
        this.CANCELADA = CANCELADA;
        this.PENDIENTE = PENDIENTE;
    }

    validate(data) {
        const { total, ACTIVA, SUSPENDIDA, CANCELADA, PENDIENTE } = data;
        if (typeof total !== "number" || total < 0) {
            throw new Error("MetricasEmpresa: total debe ser número no negativo");
        }
        if (ACTIVA + SUSPENDIDA + CANCELADA + PENDIENTE !== total) {
            throw new Error("MetricasEmpresa: suma de estados debe igualar total");
        }
    }

    /**
     * Factory method desde datos de BD
     */
    static desde(datos) {
        return new MetricasEmpresa({
            total: datos.total || 0,
            ACTIVA: datos.ACTIVA || 0,
            SUSPENDIDA: datos.SUSPENDIDA || 0,
            CANCELADA: datos.CANCELADA || 0,
            PENDIENTE: datos.PENDIENTE || 0,
        });
    }

    toJSON() {
        return {
            total: this.total,
            ACTIVA: this.ACTIVA,
            SUSPENDIDA: this.SUSPENDIDA,
            CANCELADA: this.CANCELADA,
            PENDIENTE: this.PENDIENTE,
        };
    }
}

module.exports = MetricasEmpresa;
