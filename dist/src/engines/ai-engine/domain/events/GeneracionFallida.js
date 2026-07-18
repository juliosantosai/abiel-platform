"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class GeneracionFallida extends DomainEvent {
    static eventName = "GeneracionFallida";
    constructor({ requestId, conversationId, empresaId, error }) {
        super();
        this.data = { requestId, conversationId, empresaId, error };
    }
}
module.exports = GeneracionFallida;
//# sourceMappingURL=GeneracionFallida.js.map