"use strict";
const EvolutionWebhookAdapter = require("../adapters/EvolutionWebhookAdapter");
const DetectarIntervencionHumanaUseCase = require("../../application/use-cases/DetectarIntervencionHumanaUseCase");
const CrearConversationSessionUseCase = require("../../application/use-cases/CrearConversationSessionUseCase");
/**
 * EvolutionWebhookHandler
 *
 * Orquesta la recepción de un webhook de Evolution API:
 *   1. Normaliza el payload con el adapter.
 *   2. Busca o crea la sesión de conversación.
 *   3. Si el remitente es HUMAN, dispara DetectarIntervencionHumana.
 *
 * No contiene lógica de dominio.
 */
class EvolutionWebhookHandler {
    constructor({ repository, eventPublisher, uuidFn, botNumbers = [] }) {
        this.repository = repository;
        this.adapter = new EvolutionWebhookAdapter({ botNumbers });
        this.crearSession = new CrearConversationSessionUseCase({ repository, eventPublisher });
        this.detectarIntervencion = new DetectarIntervencionHumanaUseCase({ repository, eventPublisher });
        this.uuidFn = uuidFn;
    }
    async handle(payload) {
        const comando = this.adapter.normalize(payload);
        let session = await this.repository.buscarPorClienteYEmpresa(comando.clienteId, comando.empresaId);
        if (!session) {
            session = await this.crearSession.execute({
                id: this.uuidFn(),
                empresaId: comando.empresaId,
                clienteId: comando.clienteId
            });
        }
        if (comando.senderType === "HUMAN") {
            session = await this.detectarIntervencion.execute({
                conversationId: session.id
            });
        }
        return { session, comando };
    }
}
module.exports = EvolutionWebhookHandler;
//# sourceMappingURL=EvolutionWebhookHandler.js.map