"use strict";
const LLMProvider = require("../../../../engines/ai-engine/domain/repositories/LLMProvider");
/**
 * Adaptador fake para tests. Devuelve una respuesta configurable sin llamadas externas.
 */
class FakeLLMProvider extends LLMProvider {
    constructor({ response = "Respuesta de prueba." } = {}) {
        super();
        this.response = response;
        this.calls = [];
    }
    async generate(opts) {
        this.calls.push(opts);
        return { text: this.response, usage: { tokens: 10 } };
    }
}
module.exports = FakeLLMProvider;
//# sourceMappingURL=FakeLLMProvider.js.map