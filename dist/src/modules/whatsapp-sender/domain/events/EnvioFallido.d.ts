declare const DomainEvent: any;
declare class EnvioFallido extends DomainEvent {
    static eventName: string;
    constructor({ messageId, conversationId, empresaId, error, intentos }: {
        messageId: any;
        conversationId: any;
        empresaId: any;
        error: any;
        intentos: any;
    });
}
//# sourceMappingURL=EnvioFallido.d.ts.map