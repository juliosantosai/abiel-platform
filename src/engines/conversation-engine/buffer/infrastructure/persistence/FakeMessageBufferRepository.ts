const MessageBufferRepository = require("../../domain/repositories/MessageBufferRepository");
const MessageBuffer = require("../../domain/entities/MessageBuffer");

class FakeMessageBufferRepository extends MessageBufferRepository {
    constructor() {
        super();
        this.storage = new Map();
    }

    async guardar(buffer) {
        this.storage.set(buffer.id, buffer);
        return buffer;
    }

    async buscarPorId(id) {
        return this.storage.get(id) || null;
    }

    async buscarActivo(conversationId, empresaId) {
        for (const buf of this.storage.values()) {
            if (buf.conversationId === conversationId &&
                buf.empresaId === empresaId &&
                buf.estado === "COLLECTING") {
                return buf;
            }
        }
        return null;
    }

    async buscarExpirados(ahora) {
        return Array.from(this.storage.values()).filter(b => b.estaExpirado(ahora));
    }

    async actualizar(buffer) {
        if (!this.storage.has(buffer.id)) throw new Error(`Buffer ${buffer.id} no encontrado.`);
        this.storage.set(buffer.id, buffer);
        return buffer;
    }
}

module.exports = FakeMessageBufferRepository;
