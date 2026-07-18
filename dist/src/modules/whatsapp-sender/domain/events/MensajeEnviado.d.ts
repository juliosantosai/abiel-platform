declare const DomainEvent: any;
declare class MensajeEnviado extends DomainEvent {
    static eventName: string;
    constructor({ messageId, conversationId, empresaId, clienteId }: {
        messageId: any;
        conversationId: any;
        empresaId: any;
        clienteId: any;
    });
}
//# sourceMappingURL=MensajeEnviado.d.ts.map