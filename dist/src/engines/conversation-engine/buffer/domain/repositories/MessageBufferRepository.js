"use strict";
class MessageBufferRepository {
    async guardar(buffer) { throw new Error("guardar() no implementado."); }
    async buscarPorId(id) { throw new Error("buscarPorId() no implementado."); }
    async buscarActivo(conversationId, empresaId) { throw new Error("buscarActivo() no implementado."); }
    async buscarExpirados(ahora) { throw new Error("buscarExpirados() no implementado."); }
    async actualizar(buffer) { throw new Error("actualizar() no implementado."); }
}
module.exports = MessageBufferRepository;
//# sourceMappingURL=MessageBufferRepository.js.map