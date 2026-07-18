"use strict";
const NombreUsuario = require("../valueObjects/NombreUsuario");
const EmailUsuario = require("../valueObjects/EmailUsuario");
const RolUsuario = require("../valueObjects/RolUsuario");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");
class Usuario {
    constructor({ id, empresaId, nombre, email, rol, estado = "PENDIENTE", createdAt = new Date(), updatedAt = new Date() }) {
        if (!id) {
            throw new ValidationError("El ID del usuario es obligatorio.", { id: "required" });
        }
        if (!empresaId) {
            throw new ValidationError("El ID de la empresa es obligatorio.", { empresaId: "required" });
        }
        this.id = id;
        this.empresaId = empresaId;
        this.nombre = new NombreUsuario(nombre).value;
        this.email = new EmailUsuario(email).value;
        this.rol = new RolUsuario(rol).value;
        this.estado = this.validarEstado(estado);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    validarEstado(estado) {
        if (!estado || typeof estado !== "string") {
            throw new ValidationError("El estado del usuario es obligatorio.", { estado: "required" });
        }
        const estadoNormalizado = estado.toUpperCase();
        const estadosValidos = ["PENDIENTE", "ACTIVO", "SUSPENDIDO", "CANCELADO"];
        if (!estadosValidos.includes(estadoNormalizado)) {
            throw new ValidationError("El estado del usuario no es válido.", { estado: "invalid" });
        }
        return estadoNormalizado;
    }
    actualizarNombre(nombre) {
        if (this.estado === "CANCELADO") {
            throw new DomainError("Un usuario cancelado no puede cambiar su nombre.");
        }
        this.nombre = new NombreUsuario(nombre).value;
        this.updatedAt = new Date();
    }
    cambiarEmail(email) {
        if (this.estado === "CANCELADO") {
            throw new DomainError("Un usuario cancelado no puede cambiar su email.");
        }
        this.email = new EmailUsuario(email).value;
        this.updatedAt = new Date();
    }
    cambiarRol(rol) {
        if (this.estado === "CANCELADO") {
            throw new DomainError("Un usuario cancelado no puede cambiar su rol.");
        }
        if (this.estado !== "ACTIVO") {
            throw new DomainError("Solo un usuario activo puede cambiar su rol.");
        }
        this.rol = new RolUsuario(rol).value;
        this.updatedAt = new Date();
    }
    activar() {
        if (this.estado === "CANCELADO") {
            throw new DomainError("Un usuario cancelado no puede volver a activarse.");
        }
        if (this.estado === "ACTIVO") {
            return;
        }
        if (this.estado === "PENDIENTE" || this.estado === "SUSPENDIDO") {
            this.estado = "ACTIVO";
            this.updatedAt = new Date();
            return;
        }
        throw new DomainError("No se puede activar un usuario en el estado actual.");
    }
    suspender() {
        if (this.estado === "CANCELADO") {
            throw new DomainError("Un usuario cancelado no puede ser suspendido.");
        }
        if (this.estado !== "ACTIVO") {
            throw new DomainError("Solo un usuario activo puede ser suspendido.");
        }
        this.estado = "SUSPENDIDO";
        this.updatedAt = new Date();
    }
    cancelar() {
        if (this.estado === "CANCELADO") {
            this.updatedAt = new Date();
            return;
        }
        this.estado = "CANCELADO";
        this.updatedAt = new Date();
    }
}
module.exports = Usuario;
//# sourceMappingURL=Usuario.js.map