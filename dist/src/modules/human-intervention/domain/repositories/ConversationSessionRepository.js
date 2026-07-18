"use strict";
const NotFoundError = require("../../../../shared/errors/NotFoundError");
class ConversationSessionRepository {
    async guardar(session) {
        throw new Error("guardar() no implementado.");
    }
    async buscarPorId(id) {
        throw new NotFoundError("ConversationSession", id);
    }
    async buscarPorClienteYEmpresa(clienteId, empresaId) {
        throw new NotFoundError("ConversationSession", clienteId);
    }
    async buscarPorEmpresaId(empresaId) {
        throw new Error("buscarPorEmpresaId() no implementado.");
    }
    async actualizar(session) {
        throw new Error("actualizar() no implementado.");
    }
    async eliminar(id) {
        throw new Error("eliminar() no implementado.");
    }
}
module.exports = ConversationSessionRepository;
//# sourceMappingURL=ConversationSessionRepository.js.map