const MessageBuffer = require("../../domain/entities/MessageBuffer");
const BufferAbierto = require("../../domain/events/BufferAbierto");
const BufferListo = require("../../domain/events/BufferListo");

class AgregarMensajeAlBufferUseCase {
    constructor({ repository, eventPublisher, ventanaMs = 3000, maxMensajes = 10 }) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
        this.ventanaMs = ventanaMs;
        this.maxMensajes = maxMensajes;
    }

    async execute({ id, empresaId, conversationId, mensaje }) {
        let buffer = await this.repository.buscarActivo(conversationId, empresaId);
        let esNuevo = false;

        if (!buffer) {
            buffer = new MessageBuffer({
                id,
                empresaId,
                conversationId,
                ventanaMs: this.ventanaMs,
                maxMensajes: this.maxMensajes
            });
            esNuevo = true;
        }

        buffer.agregarMensaje(mensaje);

        if (esNuevo) {
            await this.repository.guardar(buffer);
            await this.eventPublisher?.publish(new BufferAbierto({
                bufferId: buffer.id,
                conversationId: buffer.conversationId,
                empresaId: buffer.empresaId
            }));
        } else {
            await this.repository.actualizar(buffer);
        }

        if (buffer.estado === "READY") {
            await this.eventPublisher?.publish(new BufferListo({
                bufferId: buffer.id,
                conversationId: buffer.conversationId,
                empresaId: buffer.empresaId,
                mensajes: buffer.mensajes
            }));
        }

        return buffer;
    }
}

module.exports = AgregarMensajeAlBufferUseCase;
