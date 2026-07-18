const { ApiResponse } = require('../../infrastructure/api/contracts');
const AdminService = require('../services/AdminService');

class AdminController {
    constructor({ abielCore, runtimeEngine, eventBus, metrics, logBuffer } = {}) {
        this.service = new AdminService({ abielCore, runtimeEngine, eventBus, metrics, logBuffer });
    }

    async dashboard(req, res) {
        console.log('[ADMIN REQUEST]');
        console.log('endpoint:');
        console.log(req.originalUrl || req.path);
        console.log('timestamp:');
        console.log(new Date().toISOString());

        let data;
        if (typeof this.service.getDashboard === 'function') {
            data = await this.service.getDashboard();
        } else if (typeof this.service.getOverview === 'function') {
            data = await this.service.getOverview();
        } else if (typeof this.service.getStatus === 'function') {
            data = await this.service.getStatus();
        } else {
            data = { message: 'no dashboard data available' };
        }
        res.json(ApiResponse.ok({ req, data }));

        console.log('[ADMIN RESPONSE]');
        console.log('endpoint:');
        console.log(req.originalUrl || req.path);
        console.log('status:');
        console.log(res.statusCode);
        console.log('success:');
        console.log(true);
    }

    async runtime(req, res) {
        let data;
        if (typeof this.service.getRuntime === 'function') {
            data = await this.service.getRuntime();
        } else if (typeof this.service.getRuntimeState === 'function') {
            data = await this.service.getRuntimeState();
        } else {
            data = { message: 'no runtime data available' };
        }
        res.json(ApiResponse.ok({ req, data }));
    }

    async eventbus(req, res) {
        let data;
        if (typeof this.service.getEventBus === 'function') {
            data = await this.service.getEventBus();
        } else if (typeof this.service.getRuntimeState === 'function') {
            const state = await this.service.getRuntimeState();
            data = state.eventBus || {};
        } else {
            data = { message: 'no eventbus data available' };
        }
        res.json(ApiResponse.ok({ req, data }));
    }

    async capabilities(req, res) {
        let data;
        if (typeof this.service.getCapabilities === 'function') {
            data = await this.service.getCapabilities();
        } else if (typeof this.service.getRuntimeState === 'function') {
            const state = await this.service.getRuntimeState();
            data = state.core?.capabilityRegistry || [];
        } else {
            data = [];
        }
        res.json(ApiResponse.ok({ req, data }));
    }

    async memory(req, res) {
        let data;
        if (typeof this.service.getMemory === 'function') {
            data = await this.service.getMemory();
        } else {
            data = { message: 'no memory data available' };
        }
        res.json(ApiResponse.ok({ req, data }));
    }

    async tenants(req, res) {
        let data;
        if (typeof this.service.getTenants === 'function') {
            data = await this.service.getTenants();
        } else if (typeof this.service.getRuntimeState === 'function') {
            const state = await this.service.getRuntimeState();
            data = { active: state.core?.tenantId || null, registered: [], context: {} };
        } else {
            data = { active: null, registered: [], context: {} };
        }
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
        if (level) args.level = level;
        if (from) args.from = from;
        if (to) args.to = to;

        const data = await this.service.getLogs(args);
        res.json(ApiResponse.ok({ req, data }));
    }

    async config(req, res) {
        const data = await this.service.getConfig();
        res.json(ApiResponse.ok({ req, data }));
    }
}

module.exports = AdminController;
