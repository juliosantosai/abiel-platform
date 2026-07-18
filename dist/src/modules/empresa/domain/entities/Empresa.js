"use strict";
const NombreEmpresa = require("../valueObjects/NombreEmpresa");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");
class Empresa {
    constructor({ id, nombre, email = null, telefono = null, whatsappInstanceId = null, estado = "PENDIENTE", plan = "BASICO", createdAt = new Date(), updatedAt = new Date() }) {
        if (!id) {
            throw new ValidationError("El ID de la empresa es obligatorio.", { id: "required" });
        }
        this.id = id;
        this.nombre = new NombreEmpresa(nombre).value;
        this.email = email;
        this.telefono = telefono;
        this.whatsappInstanceId = whatsappInstanceId;
        this.estado = estado;
        this.plan = plan;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    actualizarNombre(nombre) {
        this.nombre = new NombreEmpresa(nombre).value;
        this.updatedAt = new Date();
    }
    cambiarPlan(plan) {
        if (!plan || typeof plan !== "string") {
            throw new ValidationError("El plan debe ser una cadena válida.", { plan: "invalid" });
        }
        this.plan = plan;
        this.updatedAt = new Date();
    }
    asignarWhatsappInstance(instanceId) {
        if (!instanceId) {
            throw new ValidationError("El ID de la instancia es obligatorio.", { whatsappInstanceId: "required" });
        }
        this.whatsappInstanceId = instanceId;
        this.updatedAt = new Date();
    }
    quitarWhatsappInstance() {
        this.whatsappInstanceId = null;
        this.updatedAt = new Date();
    }
    activar() {
        if (this.estado === "CANCELADA") {
            throw new DomainError("Una empresa cancelada no puede volver a activarse.");
        }
        this.estado = "ACTIVA";
        this.updatedAt = new Date();
    }
    suspender() {
        if (this.estado === "CANCELADA") {
            throw new DomainError("Una empresa cancelada no puede ser suspendida.");
        }
        if (this.estado === "PENDIENTE") {
            throw new DomainError("Una empresa pendiente no puede ser suspendida.");
        }
        this.estado = "SUSPENDIDA";
        this.updatedAt = new Date();
    }
    cancelar() {
        if (this.estado === "CANCELADA") {
            return;
        }
        this.estado = "CANCELADA";
        this.updatedAt = new Date();
    }
    eliminar() {
        this.cancelar();
    }
}
module.exports = Empresa;
//# sourceMappingURL=Empresa.js.map