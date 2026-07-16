import { ConversationFlow } from "../../domain/entities/ConversationFlow";
import { FlujoIniciado } from "../../domain/events/FlujoIniciado";
import { ConversationFlowRepository } from "../../domain/repositories/ConversationFlowRepository";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class IniciarFlujoUseCase {
  repository: ConversationFlowRepository;
  eventPublisher?: EventPublisherLike;

  constructor({ repository, eventPublisher }: { repository: ConversationFlowRepository; eventPublisher?: EventPublisherLike }) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
  }

  async execute({
    id,
    empresaId,
    conversationId,
    etapaInicial = "SALUDO",
    etapasValidas,
  }: {
    id: string;
    empresaId: string;
    conversationId: string;
    etapaInicial?: string;
    etapasValidas?: readonly string[];
  }): Promise<ConversationFlow> {
    const flow = new ConversationFlow({ id, empresaId, conversationId, etapa: etapaInicial, etapasValidas });
    await this.repository.guardar(flow);
    await this.eventPublisher?.publish(
      new FlujoIniciado({ flowId: flow.id, conversationId: flow.conversationId, empresaId: flow.empresaId, etapa: flow.etapa })
    );
    return flow;
  }
}
