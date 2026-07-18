"use strict";
const express = require("express");
const { autenticar } = require("../middleware/auth");
function crearRutasConversaciones(conversationControlController) {
    const router = express.Router();
    // POST /api/conversaciones/:id/bloquear - Bloquear conversación
    router.post("/:id/bloquear", autenticar, (req, res, next) => conversationControlController.bloquear(req, res, next));
    // POST /api/conversaciones/:id/cerrar - Cerrar conversación
    router.post("/:id/cerrar", autenticar, (req, res, next) => conversationControlController.cerrar(req, res, next));
    return router;
}
module.exports = { crearRutasConversaciones };
//# sourceMappingURL=conversacionesRoutes.js.map