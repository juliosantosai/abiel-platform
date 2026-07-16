import { NotFoundError } from "../../../../../shared/errors/NotFoundError";
import { FlujoFinalizado } from "../../domain/events/FlujoFinalizado";
import { ConversationFlow } from "../../domain/entities/ConversationFlow";
import { ConversationFlowRepository } from "../../domain/repositories/ConversationFlowRepository";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class FinalizarFlujoUseCase {
  repository: ConversationFlowRepository;
  eventPublisher?: EventPublisherLike;

  constructor({ repository, eventPublisher }: { repository: ConversationFlowRepository; eventPublisher?: EventPublisherLike }) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
  }

  async execute({ flowId }: { flowId: string }): Promise<ConversationFlow> {
    const flow = await this.repository.buscarPorId(flowId);
    if (!flow) throw new NotFoundError("ConversationFlow", flowId);

    flow.finalizar();
    await this.repository.actualizar(flow);
    await this.eventPublisher?.publish(
      new FlujoFinalizado({ flowId: flow.id, conversationId: flow.conversationId, empresaId: flow.empresaId })
    );
    return flow;
  }
}
