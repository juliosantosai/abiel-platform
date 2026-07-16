import { DomainEvent } from "../../../../../shared/events/DomainEvent";

export interface EtapaAvanzadaPayload {
  flowId: string;
  conversationId: string;
  empresaId: string;
  etapaAnterior: string;
  etapaNueva: string;
}

export class EtapaAvanzada extends DomainEvent {
  static eventName = "EtapaAvanzada";
  data: EtapaAvanzadaPayload;

  constructor({ flowId, conversationId, empresaId, etapaAnterior, etapaNueva }: EtapaAvanzadaPayload) {
    super();
    this.data = { flowId, conversationId, empresaId, etapaAnterior, etapaNueva };
  }
}
