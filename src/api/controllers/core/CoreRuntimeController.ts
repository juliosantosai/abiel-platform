const { ApiResponse } = require('../../contracts');
const CoreRuntimeService = require('../../services/core/CoreRuntimeService');

class CoreRuntimeController {
    constructor({ coreRuntimeService, ...dependencies } = {}) {
        this.service = coreRuntimeService || new CoreRuntimeService(dependencies);
    }

    async runtimeStatus(req, res) {
        const data = await this.service.getRuntimeStatus();
        res.json(ApiResponse.ok({ req, data }));
    }

    async modules(req, res) {
        const data = await this.service.getModules();
        res.json(ApiResponse.ok({ req, data }));
    }

    async plugins(req, res) {
        const data = await this.service.getPlugins();
        res.json(ApiResponse.ok({ req, data }));
    }

    async events(req, res) {
        const data = await this.service.getEvents();
        res.json(ApiResponse.ok({ req, data }));
    }

    async health(req, res) {
        const data = await this.service.getHealth();
        res.json(ApiResponse.ok({ req, data }));
    }
}

module.exports = CoreRuntimeController;