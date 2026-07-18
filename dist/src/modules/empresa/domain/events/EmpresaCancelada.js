"use strict";
const DomainEvent = require("../../../../core/kernel/events/DomainEvent");
class EmpresaCancelada extends DomainEvent {
    static eventName = "EmpresaCancelada";
    constructor({ empresaId, estado }) {
        super();
        this.data = { empresaId, estado };
    }
}
module.exports = EmpresaCancelada;
//# sourceMappingURL=EmpresaCancelada.js.map