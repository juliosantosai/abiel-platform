"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class UsuarioActivado extends DomainEvent {
    static eventName = "UsuarioActivado";
    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}
module.exports = UsuarioActivado;
//# sourceMappingURL=UsuarioActivado.js.map