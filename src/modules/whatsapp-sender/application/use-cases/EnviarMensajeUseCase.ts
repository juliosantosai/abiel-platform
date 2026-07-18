const OutboundMessage = require("../../domain/entities/OutboundMessage");
const MensajeEnviado = require("../../domain/events/MensajeEnviado");
const EnvioFallido = require("../../domain/events/EnvioFallido");

const MAX_INTENTOS = 3;

class EnviarMensajeUseCase {
    constructor({ messageSender, repository, eventPublisher }) {
        this.messageSender = messageSender;
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    async execute({ id, empresaId, conversationId, clienteId, contenido, tipo = "TEXT", instanceId }) {
        const msg = new OutboundMessage({ id, empresaId, conversationId, clienteId, contenido, tipo });

        if (this.repository) await this.repository.guardar(msg);

        try {
            await this.messageSender.send({
                instance: instanceId,
                remoteJid: `${clienteId}@s.whatsapp.net`,
                message: contenido
            });
            msg.marcarEnviado();
        } catch (err) {
            msg.marcarFallido();
            if (this.repository) await this.repository.actualizar(msg);

            await this.eventPublisher?.publish(new EnvioFallido({
                messageId: msg.id, conversationId, empresaId,
                error: err.message, intentos: msg.intentos
            }));
            return msg;
        }

        if (this.repository) await this.repository.actualizar(msg);

        await this.eventPublisher?.publish(new MensajeEnviado({
            messageId: msg.id, conversationId, empresaId, clienteId
        }));

        return msg;
    }
}

module.exports = EnviarMensajeUseCase;
