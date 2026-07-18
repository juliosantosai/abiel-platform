declare const DomainEvent: any;
declare class BufferProcesado extends DomainEvent {
    static eventName: string;
    constructor({ bufferId, conversationId, empresaId }: {
        bufferId: any;
        conversationId: any;
        empresaId: any;
    });
}
//# sourceMappingURL=BufferProcesado.d.ts.map