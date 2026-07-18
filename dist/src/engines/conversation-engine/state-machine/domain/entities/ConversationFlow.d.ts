declare const FlowStage: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class ConversationFlow {
    constructor({ id, empresaId, conversationId, etapa, etapaAnterior, contexto, etapasValidas, creadoEn, actualizadoEn }: {
        id: any;
        empresaId: any;
        conversationId: any;
        etapa?: string;
        etapaAnterior?: any;
        contexto?: {};
        etapasValidas?: any;
        creadoEn?: Date;
        actualizadoEn?: Date;
    });
    avanzarEtapa(nuevaEtapa: any): void;
    finalizar(): void;
    actualizarContexto(datos: any): void;
    estaFinalizado(): boolean;
}
//# sourceMappingURL=ConversationFlow.d.ts.map