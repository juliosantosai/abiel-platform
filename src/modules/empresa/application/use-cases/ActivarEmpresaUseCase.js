const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActivarEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id }) {
        const empresa = await this.empresaRepository.buscarPorId(id);
        if (!empresa) {
            throw new NotFoundError("Empresa", id);
        }

        empresa.activar();
        await this.empresaRepository.actualizar(empresa);
        await this.eventPublisher.publish("EmpresaActivada", {
            empresaId: empresa.id,
            estado: empresa.estado
        });

        return empresa;
    }
}

module.exports = ActivarEmpresaUseCase;
