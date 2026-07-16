const NotFoundError = require("../../../../shared/errors/NotFoundError");
const EtapaAvanzada = require("../../domain/events/EtapaAvanzada");

class AvanzarEtapaUseCase {
    constructor({ repository, eventPublisher }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ flowId, nuevaEtapa }) {
        const flow = await this.repository.buscarPorId(flowId);
        if (!flow) throw new NotFoundError("ConversationFlow", flowId);

        const etapaAnterior = flow.etapa;
        flow.avanzarEtapa(nuevaEtapa);
        await this.repository.actualizar(flow);

        await this.eventPublisher?.publish(new EtapaAvanzada({
            flowId: flow.id, conversationId: flow.conversationId,
            empresaId: flow.empresaId, etapaAnterior, etapaNueva: flow.etapa
        }));
        return flow;
    }
}
module.exports = AvanzarEtapaUseCase;
