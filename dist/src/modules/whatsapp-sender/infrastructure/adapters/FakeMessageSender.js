"use strict";
const MessageSender = require("../../domain/repositories/MessageSender");
class FakeMessageSender extends MessageSender {
    constructor({ shouldFail = false } = {}) {
        super();
        this.shouldFail = shouldFail;
        this.sent = [];
    }
    async send(opts) {
        if (this.shouldFail)
            throw new Error("Error de envío simulado.");
        this.sent.push(opts);
        return { success: true, messageId: `waid-${Date.now()}` };
    }
}
module.exports = FakeMessageSender;
//# sourceMappingURL=FakeMessageSender.js.map