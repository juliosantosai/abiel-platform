"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class ConversationClosed extends DomainEvent {
    static eventName = "ConversationClosed";
    constructor({ conversationId, empresaId, estado }) {
        super();
        this.data = { conversationId, empresaId, estado };
    }
}
module.exports = ConversationClosed;
//# sourceMappingURL=ConversationClosed.js.map