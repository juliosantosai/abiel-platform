const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../shared/tenant/TenantGuard");
const EmpresaActualizada = require("../../domain/events/EmpresaActualizada");

class ActualizarEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }

    async execute({ id, nombre, tenantContext }) {
        const Empresa = require("../../domain/entities/Empresa");

        const empresa = await this.empresaRepository.buscarPorId(id);
        if (!empresa) {
            throw new NotFoundError("Empresa", id);
        }

        const effective = tenantContext ?? this.tenantGuard.tenantContext;
        if (effective !== undefined && effective !== null) {
            this.tenantGuard.ensureSameTenant(empresa.id, effective);
        }

        empresa.actualizarNombre(nombre);
        await this.empresaRepository.actualizar(empresa);
        const event = new EmpresaActualizada({
            empresaId: empresa.id,
            nombre: empresa.nombre
        });

        await this.eventPublisher.publish(event);

        return empresa;
    }
}

module.exports = ActualizarEmpresaUseCase;
