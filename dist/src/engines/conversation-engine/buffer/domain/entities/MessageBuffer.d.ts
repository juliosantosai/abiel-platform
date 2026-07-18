declare const BufferState: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class MessageBuffer {
    constructor({ id, empresaId, conversationId, mensajes, estado, ventanaMs, maxMensajes, creadoEn, expiraEn, actualizadoEn }: {
        id: any;
        empresaId: any;
        conversationId: any;
        mensajes?: any[];
        estado?: string;
        ventanaMs?: number;
        maxMensajes?: number;
        creadoEn?: Date;
        expiraEn?: any;
        actualizadoEn?: Date;
    });
    agregarMensaje({ id, texto, tipo, timestamp }: {
        id: any;
        texto: any;
        tipo?: string;
        timestamp?: Date;
    }): void;
    cerrar(): void;
    marcarProcesado(): void;
    estaExpirado(ahora?: Date): boolean;
    _marcarListo(): void;
    textoConsolidado(): any;
}
//# sourceMappingURL=MessageBuffer.d.ts.map