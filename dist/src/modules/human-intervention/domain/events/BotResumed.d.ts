declare const DomainEvent: any;
declare class BotResumed extends DomainEvent {
    static eventName: string;
    constructor({ conversationId, empresaId, estado }: {
        conversationId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=BotResumed.d.ts.map