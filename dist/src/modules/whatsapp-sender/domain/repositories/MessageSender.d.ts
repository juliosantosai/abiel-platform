/**
 * Contrato abstracto para el adaptador de envío de mensajes.
 */
declare class MessageSender {
    /**
     * @param {{ instance: string, remoteJid: string, message: string }} opts
     * @returns {Promise<{ success: boolean, messageId?: string }>}
     */
    send(opts: any): Promise<void>;
}
//# sourceMappingURL=MessageSender.d.ts.map