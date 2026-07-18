"use strict";
const AIRequest = require("../../domain/entities/AIRequest");
const RespuestaGenerada = require("../../domain/events/RespuestaGenerada");
const GeneracionFallida = require("../../domain/events/GeneracionFallida");
class GenerarRespuestaUseCase {
    constructor({ llmProvider, repository, eventPublisher }) {
        this.llmProvider = llmProvider;
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }
    async execute({ id, empresaId, conversationId, mensajes, etapa, contexto, systemPrompt = "" }) {
        const request = new AIRequest({ id, empresaId, conversationId, mensajes, etapa, contexto });
        if (this.repository)
            await this.repository.guardar(request);
        request.iniciarProcesamiento();
        const historial = mensajes.map(m => `Usuario: ${m.texto}`).join("\n");
        const prompt = [
            systemPrompt,
            `Etapa actual: ${etapa}`,
            historial
        ].filter(Boolean).join("\n\n");
        try {
            const resultado = await this.llmProvider.generate({ prompt });
            request.completar(resultado.text);
        }
        catch (err) {
            request.fallar(err.message || "Error desconocido");
            if (this.repository)
                await this.repository.actualizar(request);
            await this.eventPublisher?.publish(new GeneracionFallida({
                requestId: request.id, conversationId, empresaId, error: request.error
            }));
            return request;
        }
        if (this.repository)
            await this.repository.actualizar(request);
        await this.eventPublisher?.publish(new RespuestaGenerada({
            requestId: request.id, conversationId, empresaId, respuesta: request.respuesta
        }));
        return request;
    }
}
module.exports = GenerarRespuestaUseCase;
//# sourceMappingURL=GenerarRespuestaUseCase.js.map