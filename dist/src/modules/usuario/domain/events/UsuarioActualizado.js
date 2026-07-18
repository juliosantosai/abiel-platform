"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class UsuarioActualizado extends DomainEvent {
    static eventName = "UsuarioActualizado";
    constructor({ usuarioId, empresaId, estado }) {
        super();
        this.data = { usuarioId, empresaId, estado };
    }
}
module.exports = UsuarioActualizado;
//# sourceMappingURL=UsuarioActualizado.js.map