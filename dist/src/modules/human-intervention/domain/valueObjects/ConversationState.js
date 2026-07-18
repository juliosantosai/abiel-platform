"use strict";
const ValidationError = require("../../../../shared/errors/ValidationError");
class ConversationState {
    static VALID_STATES = ["BOT_ACTIVE", "HUMAN_ACTIVE", "BOT_RESUME_PENDING", "HUMAN_LOCKED", "CLOSED"];
    constructor(value) {
        if (!value || typeof value !== "string") {
            throw new ValidationError("El estado de la conversación es obligatorio.", { estado: "required" });
        }
        const normalized = value.toUpperCase();
        if (!ConversationState.VALID_STATES.includes(normalized)) {
            throw new ValidationError(`El estado "${value}" no es válido.`, { estado: "invalid" });
        }
        this.value = normalized;
    }
    equals(other) {
        if (other instanceof ConversationState) {
            return this.value === other.value;
        }
        return this.value === other;
    }
    toString() {
        return this.value;
    }
}
module.exports = ConversationState;
//# sourceMappingURL=ConversationState.js.map