const ConversationFlow = require("../../domain/entities/ConversationFlow");
const FlujoIniciado = require("../../domain/events/FlujoIniciado");

class IniciarFlujoUseCase {
    constructor({ repository, eventPublisher }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id, empresaId, conversationId, etapaInicial = "SALUDO", etapasValidas }) {
        const flow = new ConversationFlow({ id, empresaId, conversationId, etapa: etapaInicial, etapasValidas });
        await this.repository.guardar(flow);
        await this.eventPublisher?.publish(new FlujoIniciado({ flowId: flow.id, conversationId: flow.conversationId, empresaId: flow.empresaId, etapa: flow.etapa }));
        return flow;
    }
}
module.exports = IniciarFlujoUseCase;
