declare const DomainEvent: any;
declare class BufferAbierto extends DomainEvent {
    static eventName: string;
    constructor({ bufferId, conversationId, empresaId }: {
        bufferId: any;
        conversationId: any;
        empresaId: any;
    });
}
//# sourceMappingURL=BufferAbierto.d.ts.map