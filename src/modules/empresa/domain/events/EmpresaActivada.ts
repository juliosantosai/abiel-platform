const DomainEvent = require("../../../../core/kernel/events/DomainEvent");

class EmpresaActivada extends DomainEvent {
    static eventName = "EmpresaActivada";

    constructor({ empresaId, estado }) {
        super();
        this.data = { empresaId, estado };
    }
}

module.exports = EmpresaActivada;
