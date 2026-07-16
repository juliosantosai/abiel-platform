const DomainEvent = require("../../../../../shared/events/DomainEvent");

class FlujoFinalizado extends DomainEvent {
    static eventName = "FlujoFinalizado";
    constructor({ flowId, conversationId, empresaId }) {
        super();
        this.data = { flowId, conversationId, empresaId };
    }
}
module.exports = FlujoFinalizado;
