declare const DomainEvent: any;
declare class FlujoFinalizado extends DomainEvent {
    static eventName: string;
    constructor({ flowId, conversationId, empresaId }: {
        flowId: any;
        conversationId: any;
        empresaId: any;
    });
}
//# sourceMappingURL=FlujoFinalizado.d.ts.map