const DomainEvent = require("../../../../../shared/events/DomainEvent");

class BufferAbierto extends DomainEvent {
    static eventName = "BufferAbierto";
    constructor({ bufferId, conversationId, empresaId }) {
        super();
        this.data = { bufferId, conversationId, empresaId };
    }
}
module.exports = BufferAbierto;
