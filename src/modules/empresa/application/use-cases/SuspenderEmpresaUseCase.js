const NotFoundError = require("../../../../shared/errors/NotFoundError");
const TenantGuard = require("../../../../core/security/TenantGuard");
const EmpresaSuspendida = require("../../domain/events/EmpresaSuspendida");

class SuspenderEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher, tenantGuard = new TenantGuard() }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
        this.tenantGuard = tenantGuard;
    }

    async execute({ id, tenantContext }) {
        const empresa = await this.empresaRepository.buscarPorId(id);
        if (!empresa) {
            throw new NotFoundError("Empresa", id);
        }

        const effective = tenantContext ?? this.tenantGuard.tenantContext;
        if (effective !== undefined && effective !== null) {
            this.tenantGuard.ensureSameTenant(empresa.id, effective);
        }

        empresa.suspender();
        await this.empresaRepository.actualizar(empresa);
        const event = new EmpresaSuspendida({
            empresaId: empresa.id,
            estado: empresa.estado
        });

        await this.eventPublisher.publish(event);

        return empresa;
    }
}

module.exports = SuspenderEmpresaUseCase;
