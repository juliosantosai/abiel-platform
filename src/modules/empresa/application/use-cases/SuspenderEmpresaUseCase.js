const NotFoundError = require("../../../../shared/errors/NotFoundError");

const EmpresaSuspendida = require("../../domain/events/EmpresaSuspendida");

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
        const event = new EmpresaSuspendida({
            empresaId: empresa.id,
            estado: empresa.estado
        });

        await this.eventPublisher.publish(event);

        return empresa;
    }
}

module.exports = SuspenderEmpresaUseCase;
