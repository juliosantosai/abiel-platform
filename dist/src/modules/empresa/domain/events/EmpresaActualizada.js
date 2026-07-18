"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class EmpresaActualizada extends DomainEvent {
    static eventName = "EmpresaActualizada";
    constructor({ empresaId, nombre }) {
        super();
        this.data = { empresaId, nombre };
    }
}
module.exports = EmpresaActualizada;
//# sourceMappingURL=EmpresaActualizada.js.map