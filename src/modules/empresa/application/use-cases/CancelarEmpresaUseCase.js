const NotFoundError = require("../../../../shared/errors/NotFoundError");

class CancelarEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id }) {
        const empresa = await this.empresaRepository.buscarPorId(id);
        if (!empresa) {
            throw new NotFoundError("Empresa", id);
        }

        empresa.cancelar();
        await this.empresaRepository.actualizar(empresa);
        await this.eventPublisher.publish("EmpresaCancelada", {
            empresaId: empresa.id,
            estado: empresa.estado
        });

        return empresa;
    }
}

module.exports = CancelarEmpresaUseCase;
