"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class UsuarioCancelado extends DomainEvent {
    static eventName = "UsuarioCancelado";
    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}
module.exports = UsuarioCancelado;
//# sourceMappingURL=UsuarioCancelado.js.map