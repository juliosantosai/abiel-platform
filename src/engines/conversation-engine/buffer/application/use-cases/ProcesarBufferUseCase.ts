const NotFoundError = require("../../../../../shared/errors/NotFoundError");
const BufferProcesado = require("../../domain/events/BufferProcesado");

class ProcesarBufferUseCase {
    constructor({ repository, eventPublisher }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ bufferId }) {
        const buffer = await this.repository.buscarPorId(bufferId);
        if (!buffer) throw new NotFoundError("MessageBuffer", bufferId);

        buffer.marcarProcesado();
        await this.repository.actualizar(buffer);

        await this.eventPublisher?.publish(new BufferProcesado({
            bufferId: buffer.id,
            conversationId: buffer.conversationId,
            empresaId: buffer.empresaId
        }));

        return buffer;
    }
}

module.exports = ProcesarBufferUseCase;
