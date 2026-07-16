import { DomainEvent } from "../../../../../shared/events/DomainEvent";
import { BufferedMessage } from "../entities/MessageBuffer";

export interface BufferListoPayload {
  bufferId: string;
  conversationId: string;
  empresaId: string;
  mensajes: BufferedMessage[];
}

export class BufferListo extends DomainEvent {
  static eventName = "BufferListo";
  data: BufferListoPayload;

  constructor({ bufferId, conversationId, empresaId, mensajes }: BufferListoPayload) {
    super();
    this.data = { bufferId, conversationId, empresaId, mensajes };
  }
}
