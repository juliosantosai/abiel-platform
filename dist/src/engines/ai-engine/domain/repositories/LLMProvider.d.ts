/**
 * Contrato abstracto para proveedores de LLM.
 * Las implementaciones concretas viven en infrastructure/adapters/.
 */
declare class LLMProvider {
    /**
     * @param {{ prompt: string, model?: string, maxTokens?: number }} opts
     * @returns {Promise<{ text: string, usage?: object }>}
     */
    generate(opts: any): Promise<void>;
}
//# sourceMappingURL=LLMProvider.d.ts.map