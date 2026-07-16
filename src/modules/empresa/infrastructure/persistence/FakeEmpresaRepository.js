const EmpresaRepository = require("../../domain/repositories/EmpresaRepository");

class FakeEmpresaRepository extends EmpresaRepository {
    constructor() {
        super();
        this.storage = new Map();
    }

    async guardar(empresa) {
        this.storage.set(empresa.id, empresa);
        return empresa;
    }

    async buscarPorId(id) {
        return this.storage.get(id) || null;
    }

    async buscarPorWhatsappInstanceId(instanceId) {
        for (const empresa of this.storage.values()) {
            if (empresa.whatsappInstanceId === instanceId) {
                return empresa;
            }
        }
        return null;
    }

    async obtenerTodas() {
        return Array.from(this.storage.values());
    }

    async actualizar(empresa) {
        if (!this.storage.has(empresa.id)) {
            throw new Error(`Empresa con id ${empresa.id} no encontrada.`);
        }

        this.storage.set(empresa.id, empresa);
        return empresa;
    }

    async eliminar(id) {
        const empresa = this.storage.get(id);
        this.storage.delete(id);
        return empresa;
    }
}

module.exports = FakeEmpresaRepository;
