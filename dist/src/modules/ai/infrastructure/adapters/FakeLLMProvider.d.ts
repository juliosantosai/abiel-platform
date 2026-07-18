declare const LLMProvider: any;
/**
 * Adaptador fake para tests. Devuelve una respuesta configurable sin llamadas externas.
 */
declare class FakeLLMProvider extends LLMProvider {
    constructor({ response }?: {
        response?: string;
    });
    generate(opts: any): Promise<{
        text: any;
        usage: {
            tokens: number;
        };
    }>;
}
//# sourceMappingURL=FakeLLMProvider.d.ts.map