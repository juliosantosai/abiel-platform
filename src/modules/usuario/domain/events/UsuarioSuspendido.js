const DomainEvent = require("../../../../shared/events/DomainEvent");

class UsuarioSuspendido extends DomainEvent {
    static eventName = "UsuarioSuspendido";

    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}

module.exports = UsuarioSuspendido;
