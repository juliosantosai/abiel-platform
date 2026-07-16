const ConversationState = require("../valueObjects/ConversationState");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");

class ConversationSession {
    constructor({
        id,
        empresaId,
        clienteId,
        estado = "BOT_ACTIVE",
        ultimaIntervencionHumana = null,
        creadoEn = new Date(),
        actualizadoEn = new Date()
    }) {
        if (!id) throw new ValidationError("El id es obligatorio.", { id: "required" });
        if (!empresaId) throw new ValidationError("El empresaId es obligatorio.", { empresaId: "required" });
        if (!clienteId) throw new ValidationError("El clienteId es obligatorio.", { clienteId: "required" });

        this.id = id;
        this.empresaId = empresaId;
        this.clienteId = clienteId;
        this.estado = new ConversationState(estado).value;
        this.ultimaIntervencionHumana = ultimaIntervencionHumana;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
    }

    puedeResponderBot() {
        return this.estado === "BOT_ACTIVE";
    }

    detectarIntervencionHumana() {
        if (this.estado === "HUMAN_LOCKED") {
            throw new DomainError("La conversación está bloqueada y no puede cambiar por intervención humana.");
        }

        if (this.estado === "CLOSED") {
            throw new DomainError("La conversación está cerrada.");
        }

        if (this.estado === "HUMAN_ACTIVE") {
            this.ultimaIntervencionHumana = new Date();
            this.actualizadoEn = new Date();
            return;
        }

        this.estado = "HUMAN_ACTIVE";
        this.ultimaIntervencionHumana = new Date();
        this.actualizadoEn = new Date();
    }

    iniciarReanudacion() {
        if (this.estado !== "HUMAN_ACTIVE") {
            throw new DomainError("Solo se puede iniciar reanudación desde HUMAN_ACTIVE.");
        }

        this.estado = "BOT_RESUME_PENDING";
        this.actualizadoEn = new Date();
    }

    reanudarBot() {
        if (this.estado !== "BOT_RESUME_PENDING") {
            throw new DomainError("Solo se puede reanudar el bot desde BOT_RESUME_PENDING.");
        }

        this.estado = "BOT_ACTIVE";
        this.actualizadoEn = new Date();
    }

    bloquear() {
        if (this.estado === "CLOSED") {
            throw new DomainError("Una conversación cerrada no puede bloquearse.");
        }

        this.estado = "HUMAN_LOCKED";
        this.actualizadoEn = new Date();
    }

    cerrar() {
        if (this.estado === "CLOSED") {
            return;
        }

        this.estado = "CLOSED";
        this.actualizadoEn = new Date();
    }
}

module.exports = ConversationSession;
