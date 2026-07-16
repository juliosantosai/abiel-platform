const DomainEvent = require("../../../../shared/events/DomainEvent");

class UsuarioCancelado extends DomainEvent {
    static eventName = "UsuarioCancelado";

    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}

module.exports = UsuarioCancelado;
