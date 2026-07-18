"use strict";
const ConversationSessionRepository = require("../../domain/repositories/ConversationSessionRepository");
const ConversationSession = require("../../domain/entities/ConversationSession");
class FakeConversationSessionRepository extends ConversationSessionRepository {
    constructor() {
        super();
        this.storage = new Map();
    }
    async guardar(session) {
        this.storage.set(session.id, session);
        return session;
    }
    async buscarPorId(id) {
        return this.storage.get(id) || null;
    }
    async buscarPorClienteYEmpresa(clienteId, empresaId) {
        for (const session of this.storage.values()) {
            if (session.clienteId === clienteId && session.empresaId === empresaId) {
                return session;
            }
        }
        return null;
    }
    async buscarPorEmpresaId(empresaId) {
        return Array.from(this.storage.values()).filter(s => s.empresaId === empresaId);
    }
    async actualizar(session) {
        if (!this.storage.has(session.id)) {
            throw new Error(`ConversationSession ${session.id} no encontrada.`);
        }
        this.storage.set(session.id, session);
        return session;
    }
    async obtenerTodas() {
        return Array.from(this.storage.values());
    }
    async eliminar(id) {
        const session = this.storage.get(id);
        this.storage.delete(id);
        return session;
    }
}
module.exports = FakeConversationSessionRepository;
//# sourceMappingURL=FakeConversationSessionRepository.js.map