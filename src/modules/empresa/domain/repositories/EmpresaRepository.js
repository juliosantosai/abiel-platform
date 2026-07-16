class EmpresaRepository {
    async guardar(empresa) {
        throw new Error("Método guardar() no implementado.");
    }

    async buscarPorId(id) {
        throw new Error("Método buscarPorId() no implementado.");
    }

    async buscarPorWhatsappInstanceId(instanceId) {
        throw new Error("Método buscarPorWhatsappInstanceId() no implementado.");
    }

    async obtenerTodas() {
        throw new Error("Método obtenerTodas() no implementado.");
    }

    async actualizar(empresa) {
        throw new Error("Método actualizar() no implementado.");
    }

    async eliminar(id) {
        throw new Error("Método eliminar() no implementado.");
    }
}

module.exports = EmpresaRepository;
