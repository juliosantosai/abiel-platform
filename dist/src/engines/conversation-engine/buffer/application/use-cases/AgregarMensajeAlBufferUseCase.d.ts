declare const MessageBuffer: any;
declare const BufferAbierto: any;
declare const BufferListo: any;
declare class AgregarMensajeAlBufferUseCase {
    constructor({ repository, eventPublisher, ventanaMs, maxMensajes }: {
        repository: any;
        eventPublisher: any;
        ventanaMs?: number;
        maxMensajes?: number;
    });
    execute({ id, empresaId, conversationId, mensaje }: {
        id: any;
        empresaId: any;
        conversationId: any;
        mensaje: any;
    }): Promise<any>;
}
//# sourceMappingURL=AgregarMensajeAlBufferUseCase.d.ts.map