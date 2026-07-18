declare const DomainEvent: any;
declare class EtapaAvanzada extends DomainEvent {
    static eventName: string;
    constructor({ flowId, conversationId, empresaId, etapaAnterior, etapaNueva }: {
        flowId: any;
        conversationId: any;
        empresaId: any;
        etapaAnterior: any;
        etapaNueva: any;
    });
}
//# sourceMappingURL=EtapaAvanzada.d.ts.map