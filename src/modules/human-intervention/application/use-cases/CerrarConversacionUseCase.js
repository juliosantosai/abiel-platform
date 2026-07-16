const NotFoundError = require("../../../../shared/errors/NotFoundError");
const ConversationClosed = require("../../domain/events/ConversationClosed");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");

class CerrarConversacionUseCase {
    constructor({ repository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }

    async execute({ conversationId, tenantContext }) {
        const session = await this.repository.buscarPorId(conversationId);
        if (!session) throw new NotFoundError("ConversationSession", conversationId);

        const effective = tenantContext ?? this.tenantGuard.tenantContext;
        if (effective !== undefined && effective !== null) {
            this.tenantGuard.ensureTenantMatches(session, effective);
        }

        session.cerrar();
        await this.repository.actualizar(session);

        if (this.eventPublisher?.publish) {
            await this.eventPublisher.publish(new ConversationClosed({
                conversationId: session.id,
                empresaId: session.empresaId,
                estado: session.estado
            }));
        }

        return session;
    }
}

module.exports = CerrarConversacionUseCase;
