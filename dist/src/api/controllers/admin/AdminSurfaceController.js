"use strict";
const { ApiResponse } = require('../../../infrastructure/api/contracts');
const AdminService = require('../../services/AdminService');
class AdminSurfaceController {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer, moduleRegistry, pluginRegistry } = {}) {
        this.service = new AdminService({ abielCore, runtimeEngine, eventBus, metrics, logBuffer, moduleRegistry, pluginRegistry });
    }
    async dashboard(req, res) {
        const data = typeof this.service.getDashboard === 'function'
            ? await this.service.getDashboard()
            : await this.service.getOverview();
        res.json(ApiResponse.ok({ req, data }));
    }
    async eventbus(req, res) {
        const data = typeof this.service.getEventBus === 'function'
            ? await this.service.getEventBus()
            : {};
        res.json(ApiResponse.ok({ req, data }));
    }
    async capabilities(req, res) {
        const data = typeof this.service.getCapabilities === 'function'
            ? await this.service.getCapabilities()
            : [];
        res.json(ApiResponse.ok({ req, data }));
    }
    async memory(req, res) {
        const data = typeof this.service.getMemory === 'function'
            ? await this.service.getMemory()
            : { sessions: 0, conversations: 0, cache: {}, buffers: {} };
        res.json(ApiResponse.ok({ req, data }));
    }
    async tenants(req, res) {
        const data = typeof this.service.getTenants === 'function'
            ? await this.service.getTenants()
            : { active: null, registered: [], context: {} };
        res.json(ApiResponse.ok({ req, data }));
    }
    async health(req, res) {
        const data = await this.service.getHealth();
        res.json(ApiResponse.ok({ req, data }));
    }
    async metrics(req, res) {
        const data = await this.service.getMetrics();
        res.json(ApiResponse.ok({ req, data }));
    }
    async logs(req, res) {
        const { page = 1, limit = 50, level, from, to } = req.query;
        const args = { page: Number(page), perPage: Number(limit) };
        if (level)
            args.level = level;
        if (from)
            args.from = from;
        if (to)
            args.to = to;
        const data = await this.service.getLogs(args);
        res.json(ApiResponse.ok({ req, data }));
    }
    async architecture(req, res) {
        const data = await this.service.getArchitectureOverview();
        res.json(ApiResponse.ok({ req, data }));
    }
    async core(req, res) {
        const data = await this.service.getCoreInfo();
        res.json(ApiResponse.ok({ req, data }));
    }
    async engines(req, res) {
        const data = await this.service.getEnginesInfo();
        res.json(ApiResponse.ok({ req, data }));
    }
    async modules(req, res) {
        const data = await this.service.getModulesInfo();
        res.json(ApiResponse.ok({ req, data }));
    }
    async plugins(req, res) {
        const data = await this.service.getPluginsInfo();
        res.json(ApiResponse.ok({ req, data }));
    }
    async shared(req, res) {
        const data = await this.service.getSharedServicesInfo();
        res.json(ApiResponse.ok({ req, data }));
    }
    async architectureModules(req, res) {
        const data = await this.service.getArchitectureModules();
        res.json(ApiResponse.ok({ req, data }));
    }
    async componentDetail(req, res) {
        const { type, id } = req.params;
        const data = await this.service.getComponentDetail(type, id);
        if (!data) {
            return res.status(404).json({
                success: false,
                code: 'COMPONENT_NOT_FOUND',
                message: 'Component not found',
            });
        }
        res.json(ApiResponse.ok({ req, data }));
    }
    async runtime(req, res) {
        const data = typeof this.service.getRuntimeInfo === 'function'
            ? await this.service.getRuntimeInfo()
            : await this.service.getRuntime();
        res.json(ApiResponse.ok({ req, data }));
    }
    async config(req, res) {
        const data = await this.service.getConfig();
        res.json(ApiResponse.ok({ req, data }));
    }
}
module.exports = AdminSurfaceController;
//# sourceMappingURL=AdminSurfaceController.js.map