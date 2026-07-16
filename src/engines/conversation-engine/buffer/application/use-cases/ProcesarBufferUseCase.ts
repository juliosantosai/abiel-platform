import { NotFoundError } from "../../../../../shared/errors/NotFoundError";
import { BufferProcesado } from "../../domain/events/BufferProcesado";
import { MessageBuffer } from "../../domain/entities/MessageBuffer";
import { MessageBufferRepository } from "../../domain/repositories/MessageBufferRepository";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class ProcesarBufferUseCase {
  repository: MessageBufferRepository;
  eventPublisher?: EventPublisherLike;

  constructor({ repository, eventPublisher }: { repository: MessageBufferRepository; eventPublisher?: EventPublisherLike }) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
  }

  async execute({ bufferId }: { bufferId: string }): Promise<MessageBuffer> {
    const buffer = await this.repository.buscarPorId(bufferId);
    if (!buffer) throw new NotFoundError("MessageBuffer", bufferId);

    buffer.marcarProcesado();
    await this.repository.actualizar(buffer);

    await this.eventPublisher?.publish(
      new BufferProcesado({ bufferId: buffer.id, conversationId: buffer.conversationId, empresaId: buffer.empresaId })
    );

    return buffer;
  }
}
