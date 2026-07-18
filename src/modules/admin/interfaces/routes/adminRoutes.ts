function crearRutasAdmin(adminController) {
    const express = require('express');
    const router = express.Router();

    router.get('/architecture', (req, res, next) => adminController.getArchitectureOverview(req, res, next));
    router.get('/architecture/modules', (req, res, next) => adminController.getArchitectureModules(req, res, next));

    return router;
}

module.exports = { crearRutasAdmin };
