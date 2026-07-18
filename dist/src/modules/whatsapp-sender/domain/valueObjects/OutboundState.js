"use strict";
const ValidationError = require("../../../../shared/errors/ValidationError");
class OutboundState {
    static VALID = ["PENDING", "SENT", "FAILED"];
    constructor(value) {
        if (!value)
            throw new ValidationError("El estado es obligatorio.", { estado: "required" });
        const v = value.toUpperCase();
        if (!OutboundState.VALID.includes(v))
            throw new ValidationError(`Estado "${value}" inválido.`, { estado: "invalid" });
        this.value = v;
    }
    toString() { return this.value; }
}
module.exports = OutboundState;
//# sourceMappingURL=OutboundState.js.map