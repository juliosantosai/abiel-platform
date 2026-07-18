declare const AIRequest: any;
declare const RespuestaGenerada: any;
declare const GeneracionFallida: any;
declare class GenerarRespuestaUseCase {
    constructor({ llmProvider, repository, eventPublisher }: {
        llmProvider: any;
        repository: any;
        eventPublisher: any;
    });
    execute({ id, empresaId, conversationId, mensajes, etapa, contexto, systemPrompt }: {
        id: any;
        empresaId: any;
        conversationId: any;
        mensajes: any;
        etapa: any;
        contexto: any;
        systemPrompt?: string;
    }): Promise<any>;
}
//# sourceMappingURL=GenerarRespuestaUseCase.d.ts.map