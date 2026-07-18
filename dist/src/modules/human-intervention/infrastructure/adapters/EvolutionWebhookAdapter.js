"use strict";
/**
 * EvolutionWebhookAdapter
 *
 * Traduce el payload crudo de Evolution API en un comando interno
 * entendible por el módulo Conversation Control.
 *
 * Responsabilidades:
 *   - validar que el payload tenga la estructura esperada
 *   - normalizar los campos externos (fromMe, remoteJid, instance)
 *   - determinar el tipo de remitente: CUSTOMER | HUMAN | BOT
 *   - devolver un objeto de comando listo para los use cases
 *
 * No responsabilidades:
 *   - cambiar estados
 *   - conocer la máquina de estados
 *   - interactuar con el dominio directamente
 */
class EvolutionWebhookAdapter {
    /**
     * @param {object} opts
     * @param {string[]} [opts.botNumbers] - números o identificadores conocidos del bot para diferenciar de humano
     */
    constructor({ botNumbers = [] } = {}) {
        this.botNumbers = botNumbers;
    }
    /**
     * Normaliza el payload de Evolution API.
     *
     * @param {object} payload - webhook payload crudo
     * @returns {{
     *   empresaId: string,
     *   clienteId: string,
     *   senderType: "CUSTOMER" | "HUMAN" | "BOT",
     *   fromMe: boolean,
     *   messageText: string | null,
     *   rawEvent: string
     * }}
     */
    normalize(payload) {
        this._validate(payload);
        const { event, instance, data } = payload;
        const { key, message } = data;
        const { remoteJid, fromMe } = key;
        const clienteId = this._normalizeJid(remoteJid);
        const empresaId = instance;
        const messageText = message?.conversation ?? message?.extendedTextMessage?.text ?? null;
        const senderType = this._resolveSenderType(fromMe, clienteId);
        return {
            empresaId,
            clienteId,
            senderType,
            fromMe: Boolean(fromMe),
            messageText,
            rawEvent: event
        };
    }
    _validate(payload) {
        if (!payload || typeof payload !== "object") {
            throw new Error("El payload del webhook no es válido.");
        }
        if (!payload.instance) {
            throw new Error("El payload no contiene 'instance'.");
        }
        if (!payload.data?.key?.remoteJid) {
            throw new Error("El payload no contiene 'data.key.remoteJid'.");
        }
    }
    _normalizeJid(remoteJid) {
        // quita el sufijo @s.whatsapp.net o @g.us para usar solo el número
        return remoteJid.split("@")[0];
    }
    _resolveSenderType(fromMe, clienteId) {
        if (!fromMe)
            return "CUSTOMER";
        if (this.botNumbers.includes(clienteId))
            return "BOT";
        return "HUMAN";
    }
}
module.exports = EvolutionWebhookAdapter;
//# sourceMappingURL=EvolutionWebhookAdapter.js.map