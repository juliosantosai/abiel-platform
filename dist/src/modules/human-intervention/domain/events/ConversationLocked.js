"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class ConversationLocked extends DomainEvent {
    static eventName = "ConversationLocked";
    constructor({ conversationId, empresaId, estado }) {
        super();
        this.data = { conversationId, empresaId, estado };
    }
}
module.exports = ConversationLocked;
//# sourceMappingURL=ConversationLocked.js.map