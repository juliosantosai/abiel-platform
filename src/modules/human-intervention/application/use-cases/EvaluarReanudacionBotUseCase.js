const NotFoundError = require("../../../../shared/errors/NotFoundError");
const BotResumed = require("../../domain/events/BotResumed");

class EvaluarReanudacionBotUseCase {
    constructor({ repository, eventPublisher, tiempoEsperaMs = 5 * 60 * 1000 }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.tiempoEsperaMs = tiempoEsperaMs;
    }

    async execute({ conversationId, ahora = new Date() }) {
        const session = await this.repository.buscarPorId(conversationId);
        if (!session) throw new NotFoundError("ConversationSession", conversationId);

        if (session.estado !== "HUMAN_ACTIVE") return session;

        const ultimaIntervencion = session.ultimaIntervencionHumana;
        if (!ultimaIntervencion) return session;

        const transcurrido = ahora.getTime() - new Date(ultimaIntervencion).getTime();
        if (transcurrido < this.tiempoEsperaMs) return session;

        session.iniciarReanudacion();
        session.reanudarBot();
        await this.repository.actualizar(session);

        if (this.eventPublisher?.publish) {
            await this.eventPublisher.publish(new BotResumed({
                conversationId: session.id,
                empresaId: session.empresaId,
                estado: session.estado
            }));
        }

        return session;
    }
}

module.exports = EvaluarReanudacionBotUseCase;
