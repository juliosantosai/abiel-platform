const ConversationSession = require("../../domain/entities/ConversationSession");
const ConversationCreated = require("../../domain/events/ConversationCreated");
const TenantGuard = require("../../../../core/security/TenantGuard");

class CrearConversationSessionUseCase {
    constructor({ repository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }

    async execute({ id, empresaId, clienteId, tenantContext }) {
        const effective = tenantContext ?? this.tenantGuard.tenantContext;
        if (effective !== undefined && effective !== null) {
            this.tenantGuard.ensureSameTenant(empresaId, effective);
        }

        const session = new ConversationSession({ id, empresaId, clienteId });

        await this.repository.guardar(session);

        if (this.eventPublisher?.publish) {
            await this.eventPublisher.publish(new ConversationCreated({
                conversationId: session.id,
                empresaId: session.empresaId,
                clienteId: session.clienteId,
                estado: session.estado
            }));
        }

        return session;
    }
}

module.exports = CrearConversationSessionUseCase;
