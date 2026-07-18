const express = require("express");
const { autenticar } = require("../middleware/auth");

function crearRutasEmpresas(empresaController) {
    const router = express.Router();

    // POST /api/empresas - Crear empresa (sin autenticación para registro inicial)
    router.post("/", (req, res, next) => empresaController.crear(req, res, next));

    // PUT /api/empresas/:id - Actualizar empresa
    router.put("/:id", autenticar, (req, res, next) => empresaController.actualizar(req, res, next));

    // POST /api/empresas/:id/activar - Activar empresa
    router.post("/:id/activar", autenticar, (req, res, next) => empresaController.activar(req, res, next));

    // POST /api/empresas/:id/suspender - Suspender empresa
    router.post("/:id/suspender", autenticar, (req, res, next) => empresaController.suspender(req, res, next));

    // POST /api/empresas/:id/cancelar - Cancelar empresa
    router.post("/:id/cancelar", autenticar, (req, res, next) => empresaController.cancelar(req, res, next));

    return router;
}

module.exports = { crearRutasEmpresas };
