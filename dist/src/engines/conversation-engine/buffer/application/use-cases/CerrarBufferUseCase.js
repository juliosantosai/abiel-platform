"use strict";
const NotFoundError = require("../../../../../shared/errors/NotFoundError");
const BufferListo = require("../../domain/events/BufferListo");
class CerrarBufferUseCase {
    constructor({ repository, eventPublisher }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }
    async execute({ bufferId }) {
        const buffer = await this.repository.buscarPorId(bufferId);
        if (!buffer)
            throw new NotFoundError("MessageBuffer", bufferId);
        buffer.cerrar();
        await this.repository.actualizar(buffer);
        await this.eventPublisher?.publish(new BufferListo({
            bufferId: buffer.id,
            conversationId: buffer.conversationId,
            empresaId: buffer.empresaId,
            mensajes: buffer.mensajes
        }));
        return buffer;
    }
}
module.exports = CerrarBufferUseCase;
//# sourceMappingURL=CerrarBufferUseCase.js.map