"use strict";
const ConversationFlowRepository = require("../../domain/repositories/ConversationFlowRepository");
class FakeConversationFlowRepository extends ConversationFlowRepository {
    constructor() { super(); this.storage = new Map(); }
    async guardar(flow) { this.storage.set(flow.id, flow); return flow; }
    async buscarPorId(id) { return this.storage.get(id) || null; }
    async buscarPorConversacion(conversationId, empresaId) {
        for (const f of this.storage.values()) {
            if (f.conversationId === conversationId && f.empresaId === empresaId)
                return f;
        }
        return null;
    }
    async actualizar(flow) {
        if (!this.storage.has(flow.id))
            throw new Error(`Flow ${flow.id} no encontrado.`);
        this.storage.set(flow.id, flow);
        return flow;
    }
}
module.exports = FakeConversationFlowRepository;
//# sourceMappingURL=FakeConversationFlowRepository.js.map