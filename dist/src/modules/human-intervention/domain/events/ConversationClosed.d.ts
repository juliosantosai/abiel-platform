declare const DomainEvent: any;
declare class ConversationClosed extends DomainEvent {
    static eventName: string;
    constructor({ conversationId, empresaId, estado }: {
        conversationId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=ConversationClosed.d.ts.map