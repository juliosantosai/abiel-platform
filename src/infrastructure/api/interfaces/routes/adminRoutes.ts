const express = require("express");

function crearRutasAdmin(adminController) {
    const router = express.Router();

    router.get("/status", (req, res, next) => adminController.getStatus(req, res, next));
    router.get("/health", (req, res, next) => adminController.getHealth(req, res, next));
    router.get("/runtime", (req, res, next) => adminController.getRuntime(req, res, next));
    router.get("/overview", (req, res, next) => adminController.getOverview(req, res, next));

    return router;
}

module.exports = { crearRutasAdmin };
