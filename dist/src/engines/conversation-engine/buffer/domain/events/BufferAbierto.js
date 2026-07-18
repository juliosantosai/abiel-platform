"use strict";
const DomainEvent = require("../../../../../core/kernel/events/DomainEvent");
class BufferAbierto extends DomainEvent {
    static eventName = "BufferAbierto";
    constructor({ bufferId, conversationId, empresaId }) {
        super();
        this.data = { bufferId, conversationId, empresaId };
    }
}
module.exports = BufferAbierto;
//# sourceMappingURL=BufferAbierto.js.map