declare const OutboundState: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class OutboundMessage {
    constructor({ id, empresaId, conversationId, clienteId, contenido, tipo, estado, intentos, creadoEn, enviadoEn }: {
        id: any;
        empresaId: any;
        conversationId: any;
        clienteId: any;
        contenido: any;
        tipo?: string;
        estado?: string;
        intentos?: number;
        creadoEn?: Date;
        enviadoEn?: any;
    });
    marcarEnviado(): void;
    marcarFallido(): void;
    puedeReintentar(maxIntentos?: number): boolean;
    resetearParaReintento(): void;
}
//# sourceMappingURL=OutboundMessage.d.ts.map