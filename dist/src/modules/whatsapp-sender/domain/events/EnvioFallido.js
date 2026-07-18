"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class EnvioFallido extends DomainEvent {
    static eventName = "EnvioFallido";
    constructor({ messageId, conversationId, empresaId, error, intentos }) {
        super();
        this.data = { messageId, conversationId, empresaId, error, intentos };
    }
}
module.exports = EnvioFallido;
//# sourceMappingURL=EnvioFallido.js.map