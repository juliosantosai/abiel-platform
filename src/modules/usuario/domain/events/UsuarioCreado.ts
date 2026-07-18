const DomainEvent = require("../../../../core/kernel/events/DomainEvent");

class UsuarioCreado extends DomainEvent {
    static eventName = "UsuarioCreado";

    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}

module.exports = UsuarioCreado;
