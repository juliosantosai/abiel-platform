const ValidationError = require("../../../../shared/errors/ValidationError");

class BufferState {
    static VALID = ["COLLECTING", "READY", "FLUSHED"];

    constructor(value) {
        if (!value || typeof value !== "string") {
            throw new ValidationError("El estado del buffer es obligatorio.", { estado: "required" });
        }
        const v = value.toUpperCase();
        if (!BufferState.VALID.includes(v)) {
            throw new ValidationError(`El estado "${value}" no es válido para un buffer.`, { estado: "invalid" });
        }
        this.value = v;
    }

    equals(other) {
        return this.value === (other instanceof BufferState ? other.value : other);
    }

    toString() { return this.value; }
}

module.exports = BufferState;
