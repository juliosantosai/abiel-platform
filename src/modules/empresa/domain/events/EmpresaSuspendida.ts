const DomainEvent = require("../../../../core/kernel/events/DomainEvent");

class EmpresaSuspendida extends DomainEvent {
    static eventName = "EmpresaSuspendida";

    constructor({ empresaId, estado }) {
        super();
        this.data = { empresaId, estado };
    }
}

module.exports = EmpresaSuspendida;
