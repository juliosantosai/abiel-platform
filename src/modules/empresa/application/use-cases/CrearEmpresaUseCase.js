const EmpresaCreada = require("../../domain/events/EmpresaCreada");

class CrearEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher }) {
        this.empresaRepository = empresaRepository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id, nombre, email = null, telefono = null, plan = "BASICO" }) {
        const Empresa = require("../../domain/entities/Empresa");

        const empresa = new Empresa({
            id,
            nombre,
            email,
            telefono,
            plan
        });

        await this.empresaRepository.guardar(empresa);
        const event = new EmpresaCreada({
            empresaId: empresa.id,
            nombre: empresa.nombre,
            estado: empresa.estado
        });

        await this.eventPublisher.publish(event);

        return empresa;
    }
}

module.exports = CrearEmpresaUseCase;
