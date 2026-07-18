"use strict";
const CerrarBufferUseCase = require("../use-cases/CerrarBufferUseCase");
class BufferExpirationWorker {
    constructor({ repository, eventPublisher }) {
        this.repository = repository;
        this.useCase = new CerrarBufferUseCase({ repository, eventPublisher });
    }
    async run(ahora = new Date()) {
        const expirados = await this.repository.buscarExpirados(ahora);
        const resultados = [];
        for (const buffer of expirados) {
            try {
                const resultado = await this.useCase.execute({ bufferId: buffer.id });
                resultados.push({ id: buffer.id, estado: resultado.estado });
            }
            catch {
                resultados.push({ id: buffer.id, error: true });
            }
        }
        return resultados;
    }
}
module.exports = BufferExpirationWorker;
//# sourceMappingURL=BufferExpirationWorker.js.map