/**
 * Contrato abstracto para proveedores de LLM.
 * Las implementaciones concretas viven en infrastructure/adapters/.
 */
class LLMProvider {
    /**
     * @param {{ prompt: string, model?: string, maxTokens?: number }} opts
     * @returns {Promise<{ text: string, usage?: object }>}
     */
    async generate(opts) {
        throw new Error("generate() no implementado.");
    }
}

module.exports = LLMProvider;
