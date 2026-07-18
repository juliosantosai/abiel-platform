declare const ConversationState: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class ConversationSession {
    constructor({ id, empresaId, clienteId, estado, ultimaIntervencionHumana, creadoEn, actualizadoEn }: {
        id: any;
        empresaId: any;
        clienteId: any;
        estado?: string;
        ultimaIntervencionHumana?: any;
        creadoEn?: Date;
        actualizadoEn?: Date;
    });
    puedeResponderBot(): boolean;
    detectarIntervencionHumana(): void;
    iniciarReanudacion(): void;
    reanudarBot(): void;
    bloquear(): void;
    cerrar(): void;
}
//# sourceMappingURL=ConversationSession.d.ts.map