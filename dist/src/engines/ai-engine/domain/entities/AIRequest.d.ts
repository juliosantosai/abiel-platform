declare const AIRequestState: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class AIRequest {
    constructor({ id, empresaId, conversationId, mensajes, etapa, contexto, estado, respuesta, error, creadoEn, completadoEn }: {
        id: any;
        empresaId: any;
        conversationId: any;
        mensajes?: any[];
        etapa?: string;
        contexto?: {};
        estado?: string;
        respuesta?: any;
        error?: any;
        creadoEn?: Date;
        completadoEn?: any;
    });
    iniciarProcesamiento(): void;
    completar(respuesta: any): void;
    fallar(error: any): void;
}
//# sourceMappingURL=AIRequest.d.ts.map