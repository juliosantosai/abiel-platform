const DomainEvent = require("../../../../shared/events/DomainEvent");

class RespuestaGenerada extends DomainEvent {
    static eventName = "RespuestaGenerada";
    constructor({ requestId, conversationId, empresaId, respuesta }) {
        super();
        this.data = { requestId, conversationId, empresaId, respuesta };
    }
}
module.exports = RespuestaGenerada;
