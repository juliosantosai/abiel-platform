/**
 * Contrato abstracto para el adaptador de envío de mensajes.
 */
class MessageSender {
    /**
     * @param {{ instance: string, remoteJid: string, message: string }} opts
     * @returns {Promise<{ success: boolean, messageId?: string }>}
     */
    async send(opts) {
        throw new Error("send() no implementado.");
    }
}
module.exports = MessageSender;
