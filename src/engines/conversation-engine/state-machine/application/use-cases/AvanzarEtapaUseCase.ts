import { NotFoundError } from "../../../../../shared/errors/NotFoundError";
import { EtapaAvanzada } from "../../domain/events/EtapaAvanzada";
import { ConversationFlow } from "../../domain/entities/ConversationFlow";
import { ConversationFlowRepository } from "../../domain/repositories/ConversationFlowRepository";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class AvanzarEtapaUseCase {
  repository: ConversationFlowRepository;
  eventPublisher?: EventPublisherLike;

  constructor({ repository, eventPublisher }: { repository: ConversationFlowRepository; eventPublisher?: EventPublisherLike }) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
  }

  async execute({ flowId, nuevaEtapa }: { flowId: string; nuevaEtapa: string }): Promise<ConversationFlow> {
    const flow = await this.repository.buscarPorId(flowId);
    if (!flow) throw new NotFoundError("ConversationFlow", flowId);

    const etapaAnterior = flow.etapa;
    flow.avanzarEtapa(nuevaEtapa);
    await this.repository.actualizar(flow);

    await this.eventPublisher?.publish(
      new EtapaAvanzada({
        flowId: flow.id,
        conversationId: flow.conversationId,
        empresaId: flow.empresaId,
        etapaAnterior,
        etapaNueva: flow.etapa,
      })
    );
    return flow;
  }
}
