const DomainEvent = require("../../../../shared/events/DomainEvent");

class EmpresaActualizada extends DomainEvent {
    static eventName = "EmpresaActualizada";

    constructor({ empresaId, nombre }) {
        super();
        this.data = { empresaId, nombre };
    }
}

module.exports = EmpresaActualizada;
