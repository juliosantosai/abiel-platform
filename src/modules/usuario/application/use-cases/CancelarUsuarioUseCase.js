const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../core/security/TenantGuard");
const UsuarioCancelado = require("../../domain/events/UsuarioCancelado");

class CancelarUsuarioUseCase {
    constructor({ usuarioRepository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.usuarioRepository = usuarioRepository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }

    async execute({ id, tenantContext }) {
        const usuario = await this.usuarioRepository.buscarPorId(id);
        if (!usuario) {
            throw new NotFoundError("Usuario", id);
        }

        const effectiveTenantContext = tenantContext ?? this.tenantGuard.tenantContext;
        if (effectiveTenantContext !== undefined && effectiveTenantContext !== null) {
            this.tenantGuard.ensureTenantMatches(usuario, effectiveTenantContext);
        }

        usuario.cancelar();
        await this.usuarioRepository.actualizar(usuario);

        if (this.eventPublisher && typeof this.eventPublisher.publish === "function") {
            const event = new UsuarioCancelado({
                usuarioId: usuario.id,
                empresaId: usuario.empresaId,
                estado: usuario.estado
            });

            await this.eventPublisher.publish(event);
        }

        return usuario;
    }
}

module.exports = CancelarUsuarioUseCase;
