"use strict";
const AIRequestState = require("../valueObjects/AIRequestState");
const ValidationError = require("../../../../shared/errors/ValidationError");
const DomainError = require("../../../../shared/errors/DomainError");
class AIRequest {
    constructor({ id, empresaId, conversationId, mensajes = [], etapa = "SALUDO", contexto = {}, estado = "PENDING", respuesta = null, error = null, creadoEn = new Date(), completadoEn = null }) {
        if (!id)
            throw new ValidationError("El id es obligatorio.", { id: "required" });
        if (!empresaId)
            throw new ValidationError("El empresaId es obligatorio.", { empresaId: "required" });
        if (!conversationId)
            throw new ValidationError("El conversationId es obligatorio.", { conversationId: "required" });
        this.id = id;
        this.empresaId = empresaId;
        this.conversationId = conversationId;
        this.mensajes = mensajes;
        this.etapa = etapa;
        this.contexto = contexto;
        this.estado = new AIRequestState(estado).value;
        this.respuesta = respuesta;
        this.error = error;
        this.creadoEn = creadoEn;
        this.completadoEn = completadoEn;
    }
    iniciarProcesamiento() {
        if (this.estado !== "PENDING")
            throw new DomainError("Solo se puede procesar una solicitud PENDING.");
        this.estado = "PROCESSING";
    }
    completar(respuesta) {
        if (this.estado !== "PROCESSING")
            throw new DomainError("Solo se puede completar una solicitud PROCESSING.");
        if (!respuesta)
            throw new ValidationError("La respuesta es obligatoria.", { respuesta: "required" });
        this.estado = "COMPLETED";
        this.respuesta = respuesta;
        this.completadoEn = new Date();
    }
    fallar(error) {
        this.estado = "FAILED";
        this.error = error;
        this.completadoEn = new Date();
    }
}
module.exports = AIRequest;
//# sourceMappingURL=AIRequest.js.map