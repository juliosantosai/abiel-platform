const DomainEvent = require("../../../../shared/events/DomainEvent");

class UsuarioActualizado extends DomainEvent {
    static eventName = "UsuarioActualizado";

    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}

module.exports = UsuarioActualizado;
