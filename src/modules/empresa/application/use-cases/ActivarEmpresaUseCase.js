const NotFoundError = require("../../../../shared/errors/NotFoundError");

const EmpresaActivada = require("../../domain/events/EmpresaActivada");

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
        const event = new EmpresaActivada({
            empresaId: empresa.id,
            estado: empresa.estado
        });

        await this.eventPublisher.publish(event);

        return empresa;
    }
}

module.exports = ActivarEmpresaUseCase;
