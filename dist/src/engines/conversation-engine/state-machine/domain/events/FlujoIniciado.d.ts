declare const DomainEvent: any;
declare class FlujoIniciado extends DomainEvent {
    static eventName: string;
    constructor({ flowId, conversationId, empresaId, etapa }: {
        flowId: any;
        conversationId: any;
        empresaId: any;
        etapa: any;
    });
}
//# sourceMappingURL=FlujoIniciado.d.ts.map