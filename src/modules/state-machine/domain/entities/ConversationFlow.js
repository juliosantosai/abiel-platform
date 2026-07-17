module.exports = require("../../../../engines/conversation-engine/state-machine/domain/entities/ConversationFlow");const FlowStage = require("../../../../engines/conversation-engine/state-machine/domain/valueObjects/FlowStage");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");

class ConversationFlow {
    constructor({
        id,
        empresaId,
        conversationId,
        etapa = "SALUDO",
        etapaAnterior = null,
        contexto = {},
        etapasValidas = FlowStage.DEFAULT_STAGES,
        creadoEn = new Date(),
        actualizadoEn = new Date()
    }) {
        if (!id) throw new ValidationError("El id es obligatorio.", { id: "required" });
        if (!empresaId) throw new ValidationError("El empresaId es obligatorio.", { empresaId: "required" });
        if (!conversationId) throw new ValidationError("El conversationId es obligatorio.", { conversationId: "required" });

        this.id = id;
        this.empresaId = empresaId;
        this.conversationId = conversationId;
        this.etapasValidas = etapasValidas;
        this.etapa = new FlowStage(etapa, etapasValidas).value;
        this.etapaAnterior = etapaAnterior;
        this.contexto = { ...contexto };
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
    }

    avanzarEtapa(nuevaEtapa) {
        if (this.etapa === "FINALIZADO") {
            throw new DomainError("Un flujo finalizado no puede avanzar de etapa.");
        }
        const validada = new FlowStage(nuevaEtapa, this.etapasValidas).value;
        this.etapaAnterior = this.etapa;
        this.etapa = validada;
        this.actualizadoEn = new Date();
    }

    finalizar() {
        if (this.etapa === "FINALIZADO") return;
        this.etapaAnterior = this.etapa;
        this.etapa = "FINALIZADO";
        this.actualizadoEn = new Date();
    }

    actualizarContexto(datos) {
        this.contexto = { ...this.contexto, ...datos };
        this.actualizadoEn = new Date();
    }

    estaFinalizado() {
        return this.etapa === "FINALIZADO";
    }
}

module.exports = ConversationFlow;
