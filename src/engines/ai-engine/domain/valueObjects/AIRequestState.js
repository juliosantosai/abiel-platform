const ValidationError = require("../../../../shared/errors/ValidationError");

class AIRequestState {
    static VALID = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];
    constructor(value) {
        if (!value) throw new ValidationError("El estado es obligatorio.", { estado: "required" });
        const v = value.toUpperCase();
        if (!AIRequestState.VALID.includes(v)) throw new ValidationError(`Estado "${value}" inválido.`, { estado: "invalid" });
        this.value = v;
    }
    toString() { return this.value; }
}
module.exports = AIRequestState;
