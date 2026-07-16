class ConversationFlowRepository {
    async guardar(flow) { throw new Error("guardar() no implementado."); }
    async buscarPorId(id) { throw new Error("buscarPorId() no implementado."); }
    async buscarPorConversacion(conversationId, empresaId) { throw new Error("buscarPorConversacion() no implementado."); }
    async actualizar(flow) { throw new Error("actualizar() no implementado."); }
}
module.exports = ConversationFlowRepository;
