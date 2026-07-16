const NotFoundError = require("../../../../shared/errors/NotFoundError");

class ActualizarEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id, nombre }) {
        const Empresa = require("../../domain/entities/Empresa");

        const empresa = await this.empresaRepository.buscarPorId(id);
        if (!empresa) {
            throw new NotFoundError("Empresa", id);
        }

        empresa.actualizarNombre(nombre);
        await this.empresaRepository.actualizar(empresa);
        await this.eventPublisher.publish("EmpresaActualizada", {
            empresaId: empresa.id,
            nombre: empresa.nombre
        });

        return empresa;
    }
}

module.exports = ActualizarEmpresaUseCase;
