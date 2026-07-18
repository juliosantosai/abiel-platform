declare const DomainEvent: any;
declare class ConversationLocked extends DomainEvent {
    static eventName: string;
    constructor({ conversationId, empresaId, estado }: {
        conversationId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=ConversationLocked.d.ts.map