"use strict";
const ValidationError = require("../../../../../shared/errors/ValidationError");
const ETAPAS_DEFAULT = ["SALUDO", "CALIFICACION", "PRESENTACION", "NEGOCIACION", "CIERRE", "POSTVENTA", "SOPORTE", "FINALIZADO"];
class FlowStage {
    constructor(value, etapasValidas = ETAPAS_DEFAULT) {
        if (!value || typeof value !== "string") {
            throw new ValidationError("La etapa es obligatoria.", { etapa: "required" });
        }
        const v = value.toUpperCase();
        if (!etapasValidas.includes(v)) {
            throw new ValidationError(`La etapa "${value}" no es válida.`, { etapa: "invalid" });
        }
        this.value = v;
    }
    static get DEFAULT_STAGES() { return ETAPAS_DEFAULT; }
    equals(other) {
        return this.value === (other instanceof FlowStage ? other.value : other);
    }
    toString() { return this.value; }
}
module.exports = FlowStage;
//# sourceMappingURL=FlowStage.js.map