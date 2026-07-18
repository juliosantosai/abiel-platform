const OutboundState = require("../valueObjects/OutboundState");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");

class OutboundMessage {
    constructor({ id, empresaId, conversationId, clienteId, contenido, tipo = "TEXT", estado = "PENDING", intentos = 0, creadoEn = new Date(), enviadoEn = null }) {
        if (!id) throw new ValidationError("El id es obligatorio.", { id: "required" });
        if (!empresaId) throw new ValidationError("El empresaId es obligatorio.", { empresaId: "required" });
        if (!clienteId) throw new ValidationError("El clienteId es obligatorio.", { clienteId: "required" });
        if (!contenido) throw new ValidationError("El contenido es obligatorio.", { contenido: "required" });

        this.id = id;
        this.empresaId = empresaId;
        this.conversationId = conversationId;
        this.clienteId = clienteId;
        this.contenido = contenido;
        this.tipo = tipo;
        this.estado = new OutboundState(estado).value;
        this.intentos = intentos;
        this.creadoEn = creadoEn;
        this.enviadoEn = enviadoEn;
    }

    marcarEnviado() {
        if (this.estado === "SENT") return;
        this.estado = "SENT";
        this.enviadoEn = new Date();
    }

    marcarFallido() {
        this.estado = "FAILED";
        this.intentos += 1;
    }

    puedeReintentar(maxIntentos = 3) {
        return this.estado === "FAILED" && this.intentos < maxIntentos;
    }

    resetearParaReintento() {
        if (!this.puedeReintentar()) throw new DomainError("No se puede reintentar este mensaje.");
        this.estado = "PENDING";
    }
}

module.exports = OutboundMessage;
