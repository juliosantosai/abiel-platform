const DomainEvent = require("../../../../shared/events/DomainEvent");

class BufferProcesado extends DomainEvent {
    static eventName = "BufferProcesado";
    constructor({ bufferId, conversationId, empresaId }) {
        super();
        this.data = { bufferId, conversationId, empresaId };
    }
}
module.exports = BufferProcesado;
