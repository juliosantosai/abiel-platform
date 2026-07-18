"use strict";
const NotFoundError = require("../../../../../shared/errors/NotFoundError");
const FlujoFinalizado = require("../../domain/events/FlujoFinalizado");
class FinalizarFlujoUseCase {
    constructor({ repository, eventPublisher }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }
    async execute({ flowId }) {
        const flow = await this.repository.buscarPorId(flowId);
        if (!flow)
            throw new NotFoundError("ConversationFlow", flowId);
        flow.finalizar();
        await this.repository.actualizar(flow);
        await this.eventPublisher?.publish(new FlujoFinalizado({ flowId: flow.id, conversationId: flow.conversationId, empresaId: flow.empresaId }));
        return flow;
    }
}
module.exports = FinalizarFlujoUseCase;
//# sourceMappingURL=FinalizarFlujoUseCase.js.map