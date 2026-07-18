"use strict";
const express = require('express');
const CoreRuntimeController = require('../controllers/core/CoreRuntimeController');
function crearRutasCore(options = {}) {
    const router = express.Router();
    const controller = new CoreRuntimeController(options);
    router.get('/runtime/status', controller.runtimeStatus.bind(controller));
    router.get('/modules', controller.modules.bind(controller));
    router.get('/plugins', controller.plugins.bind(controller));
    router.get('/events', controller.events.bind(controller));
    router.get('/health', controller.health.bind(controller));
    return router;
}
module.exports = { crearRutasCore };
//# sourceMappingURL=core.routes.js.map