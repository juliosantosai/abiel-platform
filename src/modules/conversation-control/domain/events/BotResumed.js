const DomainEvent = require("../../../../shared/events/DomainEvent");

class BotResumed extends DomainEvent {
    static eventName = "BotResumed";

    constructor({ conversationId, empresaId, estado }) {
        super();
        this.data = { conversationId, empresaId, estado };
    }
}

module.exports = BotResumed;
