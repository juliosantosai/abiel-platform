"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class RespuestaGenerada extends DomainEvent {
    static eventName = "RespuestaGenerada";
    constructor({ requestId, conversationId, empresaId, respuesta }) {
        super();
        this.data = { requestId, conversationId, empresaId, respuesta };
    }
}
module.exports = RespuestaGenerada;
//# sourceMappingURL=RespuestaGenerada.js.map