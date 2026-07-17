const DomainEvent = require("../../../../core/kernel/events/DomainEvent");

class ConversationCreated extends DomainEvent {
    static eventName = "ConversationCreated";

    constructor({ conversationId, empresaId, clienteId, estado }) {
        super();
        this.data = { conversationId, empresaId, clienteId, estado };
    }
}

module.exports = ConversationCreated;
