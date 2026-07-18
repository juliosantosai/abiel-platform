const DomainEvent = require("../../../../core/kernel/events/DomainEvent");

class MensajeEnviado extends DomainEvent {
    static eventName = "MensajeEnviado";
    constructor({ messageId, conversationId, empresaId, clienteId }) {
        super();
        this.data = { messageId, conversationId, empresaId, clienteId };
    }
}
module.exports = MensajeEnviado;
