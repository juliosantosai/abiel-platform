const DomainEvent = require("../../../../shared/events/DomainEvent");

class HumanInterventionDetected extends DomainEvent {
    static eventName = "HumanInterventionDetected";

    constructor({ conversationId, empresaId, estadoAnterior, estadoNuevo }) {
        super();
        this.data = { conversationId, empresaId, estadoAnterior, estadoNuevo };
    }
}

module.exports = HumanInterventionDetected;
