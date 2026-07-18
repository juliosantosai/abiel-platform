"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class UsuarioSuspendido extends DomainEvent {
    static eventName = "UsuarioSuspendido";
    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}
module.exports = UsuarioSuspendido;
//# sourceMappingURL=UsuarioSuspendido.js.map