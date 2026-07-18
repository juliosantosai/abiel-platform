declare const DomainEvent: any;
declare class GeneracionFallida extends DomainEvent {
    static eventName: string;
    constructor({ requestId, conversationId, empresaId, error }: {
        requestId: any;
        conversationId: any;
        empresaId: any;
        error: any;
    });
}
//# sourceMappingURL=GeneracionFallida.d.ts.map