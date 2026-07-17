import { DomainEvent } from "../../../../../core/kernel/events/DomainEvent";

export interface BufferAbiertoPayload {
  bufferId: string;
  conversationId: string;
  empresaId: string;
}

export class BufferAbierto extends DomainEvent {
  static eventName = "BufferAbierto";
  data: BufferAbiertoPayload;

  constructor({ bufferId, conversationId, empresaId }: BufferAbiertoPayload) {
    super();
    this.data = { bufferId, conversationId, empresaId };
  }
}
