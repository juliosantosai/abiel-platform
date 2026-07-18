"use strict";
const UsuarioCreado = require("../../domain/events/UsuarioCreado");
const TenantGuard = require("../../../../core/security/TenantGuard");
class CrearUsuarioUseCase {
    constructor({ usuarioRepository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.usuarioRepository = usuarioRepository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }
    async execute({ id, empresaId, nombre, email, rol, tenantContext }) {
        const Usuario = require("../../domain/entities/Usuario");
        const usuario = new Usuario({
            id,
            empresaId,
            nombre,
            email,
            rol
        });
        const effectiveTenantContext = tenantContext ?? this.tenantGuard.tenantContext;
        if (effectiveTenantContext !== undefined && effectiveTenantContext !== null) {
            this.tenantGuard.ensureSameTenant(empresaId, effectiveTenantContext);
        }
        await this.usuarioRepository.guardar(usuario);
        if (this.eventPublisher && typeof this.eventPublisher.publish === "function") {
            const event = new UsuarioCreado({
                usuarioId: usuario.id,
                empresaId: usuario.empresaId,
                estado: usuario.estado
            });
            await this.eventPublisher.publish(event);
        }
        return usuario;
    }
}
module.exports = CrearUsuarioUseCase;
//# sourceMappingURL=CrearUsuarioUseCase.js.map