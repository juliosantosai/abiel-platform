"use strict";
const EvaluarReanudacionBotUseCase = require("../use-cases/EvaluarReanudacionBotUseCase");
/**
 * Worker que evalúa periódicamente si alguna conversación en HUMAN_ACTIVE
 * puede reanudar el control automático del bot.
 *
 * Diseñado para ejecutarse en un proceso de fondo (cron, setInterval, job queue).
 * No conoce Prisma, Evolution API ni ningún canal externo.
 */
class BotResumptionWorker {
    constructor({ repository, eventPublisher, tiempoEsperaMs = 5 * 60 * 1000 }) {
        this.repository = repository;
        this.useCase = new EvaluarReanudacionBotUseCase({ repository, eventPublisher, tiempoEsperaMs });
    }
    async run() {
        const conversaciones = await this.repository.buscarPendientesDeReanudacion
            ? await this.repository.buscarPendientesDeReanudacion()
            : await this._buscarHumanActivas();
        const resultados = [];
        for (const session of conversaciones) {
            try {
                const resultado = await this.useCase.execute({ conversationId: session.id });
                resultados.push({ id: session.id, estado: resultado.estado });
            }
            catch {
                resultados.push({ id: session.id, error: true });
            }
        }
        return resultados;
    }
    async _buscarHumanActivas() {
        const todas = await this.repository.obtenerTodas?.() ?? [];
        return todas.filter(s => s.estado === "HUMAN_ACTIVE");
    }
}
module.exports = BotResumptionWorker;
//# sourceMappingURL=BotResumptionWorker.js.map