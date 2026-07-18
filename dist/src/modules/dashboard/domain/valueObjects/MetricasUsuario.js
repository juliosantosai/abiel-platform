"use strict";
/**
 * Value Object: MetricasUsuario
 * Representa conteos de usuarios por rol
 */
class MetricasUsuario {
    constructor({ total = 0, ADMIN = 0, SUPERVISOR = 0, AGENTE = 0, CLIENTE = 0 } = {}) {
        this.validate({ total, ADMIN, SUPERVISOR, AGENTE, CLIENTE });
        this.total = total;
        this.ADMIN = ADMIN;
        this.SUPERVISOR = SUPERVISOR;
        this.AGENTE = AGENTE;
        this.CLIENTE = CLIENTE;
    }
    validate(data) {
        const { total, ADMIN, SUPERVISOR, AGENTE, CLIENTE } = data;
        if (typeof total !== "number" || total < 0) {
            throw new Error("MetricasUsuario: total debe ser número no negativo");
        }
        if (ADMIN + SUPERVISOR + AGENTE + CLIENTE !== total) {
            throw new Error("MetricasUsuario: suma de roles debe igualar total");
        }
    }
    static desde(datos) {
        return new MetricasUsuario({
            total: datos.total || 0,
            ADMIN: datos.ADMIN || 0,
            SUPERVISOR: datos.SUPERVISOR || 0,
            AGENTE: datos.AGENTE || 0,
            CLIENTE: datos.CLIENTE || 0,
        });
    }
    toJSON() {
        return {
            total: this.total,
            ADMIN: this.ADMIN,
            SUPERVISOR: this.SUPERVISOR,
            AGENTE: this.AGENTE,
            CLIENTE: this.CLIENTE,
        };
    }
}
module.exports = MetricasUsuario;
//# sourceMappingURL=MetricasUsuario.js.map