const DomainEvent = require("../../../../shared/events/DomainEvent");

class EnvioFallido extends DomainEvent {
    static eventName = "EnvioFallido";
    constructor({ messageId, conversationId, empresaId, error, intentos }) {
        super();
        this.data = { messageId, conversationId, empresaId, error, intentos };
    }
}
module.exports = EnvioFallido;
