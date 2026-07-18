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
declare class EvolutionWebhookAdapter {
    /**
     * @param {object} opts
     * @param {string[]} [opts.botNumbers] - números o identificadores conocidos del bot para diferenciar de humano
     */
    constructor({ botNumbers }?: {
        botNumbers?: any[];
    });
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
    normalize(payload: any): {
        empresaId: any;
        clienteId: any;
        senderType: string;
        fromMe: boolean;
        messageText: any;
        rawEvent: any;
    };
    _validate(payload: any): void;
    _normalizeJid(remoteJid: any): any;
    _resolveSenderType(fromMe: any, clienteId: any): "CUSTOMER" | "BOT" | "HUMAN";
}
//# sourceMappingURL=EvolutionWebhookAdapter.d.ts.map