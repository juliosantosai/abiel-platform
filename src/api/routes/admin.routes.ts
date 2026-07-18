const express = require('express');
const AdminController = require('../controllers/AdminController');

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
    const { validateLogs } = require('../validators/adminValidators');
    router.get('/logs', validateLogs, controller.logs.bind(controller));
    router.get('/config', controller.config.bind(controller));

    return router;
}

module.exports = { crearRutasAdmin };
