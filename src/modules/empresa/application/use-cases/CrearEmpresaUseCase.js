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
        await this.eventPublisher.publish("EmpresaCreada", {
            empresaId: empresa.id,
            nombre: empresa.nombre,
            estado: empresa.estado
        });

        return empresa;
    }
}

module.exports = CrearEmpresaUseCase;
