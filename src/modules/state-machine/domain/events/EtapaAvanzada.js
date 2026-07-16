const DomainEvent = require("../../../../shared/events/DomainEvent");

class EtapaAvanzada extends DomainEvent {
    static eventName = "EtapaAvanzada";
    constructor({ flowId, conversationId, empresaId, etapaAnterior, etapaNueva }) {
        super();
        this.data = { flowId, conversationId, empresaId, etapaAnterior, etapaNueva };
    }
}
module.exports = EtapaAvanzada;
