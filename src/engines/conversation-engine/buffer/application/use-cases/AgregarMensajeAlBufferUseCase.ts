import { BufferAbierto } from "../../domain/events/BufferAbierto";
import { BufferListo } from "../../domain/events/BufferListo";
import { MessageBuffer, BufferedMessage } from "../../domain/entities/MessageBuffer";
import { MessageBufferRepository } from "../../domain/repositories/MessageBufferRepository";

interface EventPublisherLike {
  publish(event: unknown): Promise<void>;
}

export class AgregarMensajeAlBufferUseCase {
  repository: MessageBufferRepository;
  eventPublisher?: EventPublisherLike;
  ventanaMs: number;
  maxMensajes: number;

  constructor({
    repository,
    eventPublisher,
    ventanaMs = 3000,
    maxMensajes = 10,
  }: {
    repository: MessageBufferRepository;
    eventPublisher?: EventPublisherLike;
    ventanaMs?: number;
    maxMensajes?: number;
  }) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
    this.ventanaMs = ventanaMs;
    this.maxMensajes = maxMensajes;
  }

  async execute({
    id,
    empresaId,
    conversationId,
    mensaje,
  }: {
    id: string;
    empresaId: string;
    conversationId: string;
    mensaje: BufferedMessage;
  }): Promise<MessageBuffer> {
    let buffer = await this.repository.buscarActivo(conversationId, empresaId);
    let esNuevo = false;

    if (!buffer) {
      buffer = new MessageBuffer({ id, empresaId, conversationId, ventanaMs: this.ventanaMs, maxMensajes: this.maxMensajes });
      esNuevo = true;
    }

    buffer.agregarMensaje(mensaje);

    if (esNuevo) {
      await this.repository.guardar(buffer);
      await this.eventPublisher?.publish(
        new BufferAbierto({ bufferId: buffer.id, conversationId: buffer.conversationId, empresaId: buffer.empresaId })
      );
    } else {
      await this.repository.actualizar(buffer);
    }

    if (buffer.estado === "READY") {
      await this.eventPublisher?.publish(
        new BufferListo({
          bufferId: buffer.id,
          conversationId: buffer.conversationId,
          empresaId: buffer.empresaId,
          mensajes: buffer.mensajes,
        })
      );
    }

    return buffer;
  }
}
