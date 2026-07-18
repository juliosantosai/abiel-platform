const express = require('express');
const AdminController = require('../controllers/admin/AdminSurfaceController');

function crearRutasAdmin(options = {}) {
    const router = express.Router();
    const controller = new AdminController(options);

    router.get('/dashboard', controller.dashboard.bind(controller));
    router.get('/runtime', controller.runtime.bind(controller));
    router.get('/eventbus', controller.eventbus.bind(controller));
    router.get('/capabilities', controller.capabilities.bind(controller));
    router.get('/memory', controller.memory.bind(controller));
    router.get('/tenants', controller.tenants.bind(controller));
    router.get('/health', controller.health.bind(controller));
    router.get('/metrics', controller.metrics.bind(controller));
    router.get('/architecture', controller.architecture.bind(controller));
    router.get('/architecture/modules', controller.architectureModules.bind(controller));
    router.get('/components/:type/:id', controller.componentDetail.bind(controller));
    router.get('/architecture/:type/:id', controller.componentDetail.bind(controller));
    router.get('/core', controller.core.bind(controller));
    router.get('/engines', controller.engines.bind(controller));
    router.get('/modules', controller.modules.bind(controller));
    router.get('/plugins', controller.plugins.bind(controller));
    router.get('/shared', controller.shared.bind(controller));
    const { validateLogs } = require('../validators/adminValidators');
    router.get('/logs', validateLogs, controller.logs.bind(controller));
    router.get('/config', controller.config.bind(controller));

    return router;
}

module.exports = { crearRutasAdmin };
