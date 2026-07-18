"use strict";
const NotFoundError = require("../../../../shared/errors/NotFoundError");
const HumanInterventionDetected = require("../../domain/events/HumanInterventionDetected");
const TenantGuard = require("../../../../core/security/TenantGuard");
class DetectarIntervencionHumanaUseCase {
    constructor({ repository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }
    async execute({ conversationId, tenantContext }) {
        const session = await this.repository.buscarPorId(conversationId);
        if (!session)
            throw new NotFoundError("ConversationSession", conversationId);
        const effective = tenantContext ?? this.tenantGuard.tenantContext;
        if (effective !== undefined && effective !== null) {
            this.tenantGuard.ensureTenantMatches(session, effective);
        }
        const estadoAnterior = session.estado;
        session.detectarIntervencionHumana();
        await this.repository.actualizar(session);
        if (this.eventPublisher?.publish) {
            await this.eventPublisher.publish(new HumanInterventionDetected({
                conversationId: session.id,
                empresaId: session.empresaId,
                estadoAnterior,
                estadoNuevo: session.estado
            }));
        }
        return session;
    }
}
module.exports = DetectarIntervencionHumanaUseCase;
//# sourceMappingURL=DetectarIntervencionHumanaUseCase.js.map