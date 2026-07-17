import { DomainEvent } from "../../../../../core/kernel/events/DomainEvent";

export interface FlujoIniciadoPayload {
  flowId: string;
  conversationId: string;
  empresaId: string;
  etapa: string;
}

export class FlujoIniciado extends DomainEvent {
  static eventName = "FlujoIniciado";
  data: FlujoIniciadoPayload;

  constructor({ flowId, conversationId, empresaId, etapa }: FlujoIniciadoPayload) {
    super();
    this.data = { flowId, conversationId, empresaId, etapa };
  }
}
