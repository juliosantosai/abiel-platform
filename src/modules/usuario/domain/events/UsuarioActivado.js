const DomainEvent = require("../../../../shared/events/DomainEvent");

class UsuarioActivado extends DomainEvent {
    static eventName = "UsuarioActivado";

    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}

module.exports = UsuarioActivado;
