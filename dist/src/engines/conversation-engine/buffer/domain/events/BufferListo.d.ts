declare const DomainEvent: any;
declare class BufferListo extends DomainEvent {
    static eventName: string;
    constructor({ bufferId, conversationId, empresaId, mensajes }: {
        bufferId: any;
        conversationId: any;
        empresaId: any;
        mensajes: any;
    });
}
//# sourceMappingURL=BufferListo.d.ts.map