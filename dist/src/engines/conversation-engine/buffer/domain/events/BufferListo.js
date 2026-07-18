"use strict";
const DomainEvent = require("../../../../../core/kernel/events/DomainEvent");
class BufferListo extends DomainEvent {
    static eventName = "BufferListo";
    constructor({ bufferId, conversationId, empresaId, mensajes }) {
        super();
        this.data = { bufferId, conversationId, empresaId, mensajes };
    }
}
module.exports = BufferListo;
//# sourceMappingURL=BufferListo.js.map