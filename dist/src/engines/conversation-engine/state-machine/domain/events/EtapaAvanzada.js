"use strict";
const DomainEvent = require("../../../../../core/kernel/events/DomainEvent");
class EtapaAvanzada extends DomainEvent {
    static eventName = "EtapaAvanzada";
    constructor({ flowId, conversationId, empresaId, etapaAnterior, etapaNueva }) {
        super();
        this.data = { flowId, conversationId, empresaId, etapaAnterior, etapaNueva };
    }
}
module.exports = EtapaAvanzada;
//# sourceMappingURL=EtapaAvanzada.js.map