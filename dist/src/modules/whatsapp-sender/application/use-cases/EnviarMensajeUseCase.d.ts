declare const OutboundMessage: any;
declare const MensajeEnviado: any;
declare const EnvioFallido: any;
declare const MAX_INTENTOS = 3;
declare class EnviarMensajeUseCase {
    constructor({ messageSender, repository, eventPublisher }: {
        messageSender: any;
        repository: any;
        eventPublisher: any;
    });
    execute({ id, empresaId, conversationId, clienteId, contenido, tipo, instanceId }: {
        id: any;
        empresaId: any;
        conversationId: any;
        clienteId: any;
        contenido: any;
        tipo?: string;
        instanceId: any;
    }): Promise<any>;
}
//# sourceMappingURL=EnviarMensajeUseCase.d.ts.map