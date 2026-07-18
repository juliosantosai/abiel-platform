declare const DomainEvent: any;
declare class RespuestaGenerada extends DomainEvent {
    static eventName: string;
    constructor({ requestId, conversationId, empresaId, respuesta }: {
        requestId: any;
        conversationId: any;
        empresaId: any;
        respuesta: any;
    });
}
//# sourceMappingURL=RespuestaGenerada.d.ts.map