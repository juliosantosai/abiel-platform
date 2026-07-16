import { DomainEvent } from "../../../../../shared/events/DomainEvent";

export interface FlujoFinalizadoPayload {
  flowId: string;
  conversationId: string;
  empresaId: string;
}

export class FlujoFinalizado extends DomainEvent {
  static eventName = "FlujoFinalizado";
  data: FlujoFinalizadoPayload;

  constructor({ flowId, conversationId, empresaId }: FlujoFinalizadoPayload) {
    super();
    this.data = { flowId, conversationId, empresaId };
  }
}
