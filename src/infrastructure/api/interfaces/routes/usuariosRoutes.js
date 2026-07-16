const express = require("express");
const { autenticar } = require("../middleware/auth");

function crearRutasUsuarios(usuarioController) {
    const router = express.Router();

    // POST /api/usuarios - Crear usuario
    router.post("/", autenticar, (req, res, next) => usuarioController.crear(req, res, next));

    // PUT /api/usuarios/:id - Actualizar usuario
    router.put("/:id", autenticar, (req, res, next) => usuarioController.actualizar(req, res, next));

    // POST /api/usuarios/:id/activar - Activar usuario
    router.post("/:id/activar", autenticar, (req, res, next) => usuarioController.activar(req, res, next));

    // POST /api/usuarios/:id/suspender - Suspender usuario
    router.post("/:id/suspender", autenticar, (req, res, next) => usuarioController.suspender(req, res, next));

    // POST /api/usuarios/:id/cancelar - Cancelar usuario
    router.post("/:id/cancelar", autenticar, (req, res, next) => usuarioController.cancelar(req, res, next));

    return router;
}

module.exports = { crearRutasUsuarios };
