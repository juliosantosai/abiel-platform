import { NotFoundError } from "../../../../../shared/errors/NotFoundError";
import { BufferListo } from "../../domain/events/BufferListo";
import { MessageBuffer } from "../../domain/entities/MessageBuffer";
import { MessageBufferRepository } from "../../domain/repositories/MessageBufferRepository";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class CerrarBufferUseCase {
  repository: MessageBufferRepository;
  eventPublisher?: EventPublisherLike;

  constructor({ repository, eventPublisher }: { repository: MessageBufferRepository; eventPublisher?: EventPublisherLike }) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
  }

  async execute({ bufferId }: { bufferId: string }): Promise<MessageBuffer> {
    const buffer = await this.repository.buscarPorId(bufferId);
    if (!buffer) throw new NotFoundError("MessageBuffer", bufferId);

    buffer.cerrar();
    await this.repository.actualizar(buffer);

    await this.eventPublisher?.publish(
      new BufferListo({
        bufferId: buffer.id,
        conversationId: buffer.conversationId,
        empresaId: buffer.empresaId,
        mensajes: buffer.mensajes,
      })
    );

    return buffer;
  }
}
