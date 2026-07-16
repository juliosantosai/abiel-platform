const DomainEvent = require("../../../../shared/events/DomainEvent");

class EmpresaCancelada extends DomainEvent {
    static eventName = "EmpresaCancelada";

    constructor({ empresaId, estado }) {
        super();
        this.data = { empresaId, estado };
    }
}

module.exports = EmpresaCancelada;
