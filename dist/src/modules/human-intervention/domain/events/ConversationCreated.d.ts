declare const DomainEvent: any;
declare class ConversationCreated extends DomainEvent {
    static eventName: string;
    constructor({ conversationId, empresaId, clienteId, estado }: {
        conversationId: any;
        empresaId: any;
        clienteId: any;
        estado: any;
    });
}
//# sourceMappingURL=ConversationCreated.d.ts.map