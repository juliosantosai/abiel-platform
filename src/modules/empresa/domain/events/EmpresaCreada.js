const DomainEvent = require("../../../shared/events/DomainEvent");

class EmpresaCreada extends DomainEvent {
    static eventName = "EmpresaCreada";

    constructor({ empresaId, nombre, estado }) {
        super();
        this.data = { empresaId, nombre, estado };
    }
}

module.exports = EmpresaCreada;
