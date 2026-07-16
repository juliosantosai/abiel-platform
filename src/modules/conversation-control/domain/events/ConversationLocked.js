const DomainEvent = require("../../../../shared/events/DomainEvent");

class ConversationLocked extends DomainEvent {
    static eventName = "ConversationLocked";

    constructor({ conversationId, empresaId, estado }) {
        super();
        this.data = { conversationId, empresaId, estado };
    }
}

module.exports = ConversationLocked;
