"use strict";
const express = require("express");
const ApiHttpException = require("../errors/ApiHttpException");
const { registerApiPipeline } = require("../middleware/pipeline");
const { corsMiddleware } = require("../middleware/corsMiddleware");
const { manejarErrores } = require("../interfaces/middleware/auth");
const { crearRateLimiter } = require("../interfaces/middleware/rateLimit");
const { registerRuntimeHttpRoutes } = require("../../../bootstrap/http/registerRuntimeHttpRoutes");
class ExpressApp {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase, crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase, bloquearConversacionUseCase, cerrarConversacionUseCase, obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase, } = {}, extra = {}) {
        this.app = express();
        this.runtimeEngine = extra.runtimeEngine;
        this.eventBus = extra.eventBus;
        this.abielCore = extra.abielCore;
        // Middleware global
        this.app.use(express.json());
        // Rate limiter: 100 requests per minute per IP
        const apiLimiter = crearRateLimiter(100, 60000);
        registerApiPipeline(this.app, { rateLimiter: apiLimiter });
        // Ensure global preflight handler runs before any auth middleware
        // This guarantees OPTIONS requests are handled by CORS middleware and
        // do not reach protected routes that require x-admin-token.
        this.app.use((req, res, next) => {
            if (req.method === 'OPTIONS') {
                return corsMiddleware(req, res, next);
            }
            return next();
        });
        registerRuntimeHttpRoutes(this.app, {
            crearEmpresaUseCase,
            actualizarEmpresaUseCase,
            activarEmpresaUseCase,
            suspenderEmpresaUseCase,
            cancelarEmpresaUseCase,
            crearUsuarioUseCase,
            actualizarUsuarioUseCase,
            activarUsuarioUseCase,
            suspenderUsuarioUseCase,
            cancelarUsuarioUseCase,
            bloquearConversacionUseCase,
            cerrarConversacionUseCase,
            obtenerMetricasGlobalesUseCase,
            obtenerActividadRecienteUseCase,
        }, extra);
        // 404
        this.app.use((req, res) => {
            throw new ApiHttpException({
                status: 404,
                code: "ROUTE_NOT_FOUND",
                message: "Ruta no encontrada",
            });
        });
        // Middleware de manejo de errores (al final)
        this.app.use(manejarErrores);
    }
    listen(port = 3000) {
        this.app.listen(port, () => {
            const env = process.env.NODE_ENV || 'development';
            console.log('[ABIEL CORE]');
            console.log('Server started');
            console.log(`Port: ${port}`);
            console.log(`Environment: ${env}`);
        });
    }
}
module.exports = ExpressApp;
//# sourceMappingURL=ExpressApp.js.map