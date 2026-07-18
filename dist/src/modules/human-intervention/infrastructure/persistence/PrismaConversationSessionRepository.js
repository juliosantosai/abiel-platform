"use strict";
const ConversationSessionRepository = require("../../domain/repositories/ConversationSessionRepository");
const ConversationSession = require("../../domain/entities/ConversationSession");
const prisma = require("../../../../shared/database/prisma");
class PrismaConversationSessionRepository extends ConversationSessionRepository {
    #toEntity(record) {
        return new ConversationSession({
            id: record.id,
            empresaId: record.empresaId,
            clienteId: record.clienteId,
            estado: record.estado,
            ultimaIntervencionHumana: record.ultimaIntervencionHumana,
            creadoEn: record.creadoEn,
            actualizadoEn: record.actualizadoEn
        });
    }
    async guardar(session) {
        await prisma.conversationSession.create({
            data: {
                id: session.id,
                empresaId: session.empresaId,
                clienteId: session.clienteId,
                estado: session.estado,
                ultimaIntervencionHumana: session.ultimaIntervencionHumana,
                creadoEn: session.creadoEn,
                actualizadoEn: session.actualizadoEn
            }
        });
        return session;
    }
    async buscarPorId(id) {
        const record = await prisma.conversationSession.findUnique({ where: { id } });
        return record ? this.#toEntity(record) : null;
    }
    async buscarPorClienteYEmpresa(clienteId, empresaId) {
        const record = await prisma.conversationSession.findFirst({
            where: { clienteId, empresaId }
        });
        return record ? this.#toEntity(record) : null;
    }
    async buscarPorEmpresaId(empresaId) {
        const records = await prisma.conversationSession.findMany({ where: { empresaId } });
        return records.map(r => this.#toEntity(r));
    }
    async actualizar(session) {
        await prisma.conversationSession.update({
            where: { id: session.id },
            data: {
                estado: session.estado,
                ultimaIntervencionHumana: session.ultimaIntervencionHumana,
                actualizadoEn: session.actualizadoEn
            }
        });
        return session;
    }
    async eliminar(id) {
        const record = await prisma.conversationSession.findUnique({ where: { id } });
        if (!record)
            return null;
        await prisma.conversationSession.delete({ where: { id } });
        return this.#toEntity(record);
    }
}
module.exports = PrismaConversationSessionRepository;
//# sourceMappingURL=PrismaConversationSessionRepository.js.map