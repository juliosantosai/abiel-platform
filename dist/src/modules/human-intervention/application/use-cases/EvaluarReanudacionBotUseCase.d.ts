declare const NotFoundError: any;
declare const BotResumed: any;
declare class EvaluarReanudacionBotUseCase {
    constructor({ repository, eventPublisher, tiempoEsperaMs }: {
        repository: any;
        eventPublisher: any;
        tiempoEsperaMs?: number;
    });
    execute({ conversationId, ahora }: {
        conversationId: any;
        ahora?: Date;
    }): Promise<any>;
}
//# sourceMappingURL=EvaluarReanudacionBotUseCase.d.ts.map