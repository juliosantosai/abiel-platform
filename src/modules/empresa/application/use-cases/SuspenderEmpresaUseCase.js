const NotFoundError = require("../../../../shared/errors/NotFoundError");

class SuspenderEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id }) {
        const empresa = await this.empresaRepository.buscarPorId(id);
        if (!empresa) {
            throw new NotFoundError("Empresa", id);
        }

        empresa.suspender();
        await this.empresaRepository.actualizar(empresa);
        await this.eventPublisher.publish("EmpresaSuspendida", {
            empresaId: empresa.id,
            estado: empresa.estado
        });

        return empresa;
    }
}

module.exports = SuspenderEmpresaUseCase;
