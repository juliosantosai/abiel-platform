"use strict";
const { assertNonEmptyString } = require("./commonValidators");
function validateConversationId(params = {}) {
    const { id } = params;
    assertNonEmptyString(id, "id en params");
    return { id };
}
module.exports = { validateConversationId };
//# sourceMappingURL=conversationValidators.js.map