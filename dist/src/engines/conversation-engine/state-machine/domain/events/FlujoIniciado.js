"use strict";
const DomainEvent = require("../../../../../core/kernel/events/DomainEvent");
class FlujoIniciado extends DomainEvent {
    static eventName = "FlujoIniciado";
    constructor({ flowId, conversationId, empresaId, etapa }) {
        super();
        this.data = { flowId, conversationId, empresaId, etapa };
    }
}
module.exports = FlujoIniciado;
//# sourceMappingURL=FlujoIniciado.js.map