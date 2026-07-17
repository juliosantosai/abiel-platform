import { DomainEvent } from "../../../../../core/kernel/events/DomainEvent";

export interface BufferProcesadoPayload {
  bufferId: string;
  conversationId: string;
  empresaId: string;
}

export class BufferProcesado extends DomainEvent {
  static eventName = "BufferProcesado";
  data: BufferProcesadoPayload;

  constructor({ bufferId, conversationId, empresaId }: BufferProcesadoPayload) {
    super();
    this.data = { bufferId, conversationId, empresaId };
  }
}
