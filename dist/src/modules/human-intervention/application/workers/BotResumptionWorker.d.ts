declare const EvaluarReanudacionBotUseCase: any;
/**
 * Worker que evalúa periódicamente si alguna conversación en HUMAN_ACTIVE
 * puede reanudar el control automático del bot.
 *
 * Diseñado para ejecutarse en un proceso de fondo (cron, setInterval, job queue).
 * No conoce Prisma, Evolution API ni ningún canal externo.
 */
declare class BotResumptionWorker {
    constructor({ repository, eventPublisher, tiempoEsperaMs }: {
        repository: any;
        eventPublisher: any;
        tiempoEsperaMs?: number;
    });
    run(): Promise<any[]>;
    _buscarHumanActivas(): Promise<any>;
}
//# sourceMappingURL=BotResumptionWorker.d.ts.map