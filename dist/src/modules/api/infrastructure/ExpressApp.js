"use strict";
module.exports = require("../../../infrastructure/api/infrastructure/ExpressApp");
const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const EmpresaController = require("../../../infrastructure/api/interfaces/controllers/EmpresaController");
const UsuarioController = require("../../../infrastructure/api/interfaces/controllers/UsuarioController");
const ConversationControlController = require("../../../infrastructure/api/interfaces/controllers/ConversationControlController");
const DashboardController = require("../../../infrastructure/api/interfaces/controllers/DashboardController");
const { crearRutasEmpresas } = require("../../../infrastructure/api/interfaces/routes/empresasRoutes");
const { crearRutasUsuarios } = require("../../../infrastructure/api/interfaces/routes/usuariosRoutes");
const { crearRutasConversaciones } = require("../../../infrastructure/api/interfaces/routes/conversacionesRoutes");
const { crearRutasDashboard } = require("../../../infrastructure/api/interfaces/routes/dashboardRoutes");
const { autenticar, manejarErrores } = require("../../../infrastructure/api/interfaces/middleware/auth");
const { crearRateLimiter } = require("../../../infrastructure/api/interfaces/middleware/rateLimit");
class ExpressApp {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase, crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase, bloquearConversacionUseCase, cerrarConversacionUseCase, obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase, }) {
        this.app = express();
        // Middleware global
        this.app.use(express.json());
        // Rate limiter: 100 requests per minute per IP
        const apiLimiter = crearRateLimiter(100, 60000);
        this.app.use("/api/", apiLimiter.middleware());
        // Inyectar controllers con use cases
        const empresaController = new EmpresaController({
            crearEmpresaUseCase,
            actualizarEmpresaUseCase,
            activarEmpresaUseCase,
            suspenderEmpresaUseCase,
            cancelarEmpresaUseCase,
        });
        const usuarioController = new UsuarioController({
            crearUsuarioUseCase,
            actualizarUsuarioUseCase,
            activarUsuarioUseCase,
            suspenderUsuarioUseCase,
            cancelarUsuarioUseCase,
        });
        const conversationControlController = new ConversationControlController({
            bloquearConversacionUseCase,
            cerrarConversacionUseCase,
        });
        const dashboardController = new DashboardController({
            obtenerMetricasGlobalesUseCase,
            obtenerActividadRecienteUseCase,
        });
        // Montar rutas
        this.app.use("/api/empresas", crearRutasEmpresas(empresaController));
        this.app.use("/api/usuarios", crearRutasUsuarios(usuarioController));
        this.app.use("/api/conversaciones", crearRutasConversaciones(conversationControlController));
        this.app.use("/api/dashboard", autenticar, crearRutasDashboard(dashboardController));
        // Health check
        this.app.get("/", (req, res) => {
            res.json({ success: true, message: "API Root OK" });
        });
        this.app.get("/dashboard", (req, res) => {
            res.sendFile(path.resolve(__dirname, "../../dashboard/interfaces/web/dashboard.html"));
        });
        this.app.get("/api/demo-token", (req, res) => {
            const secret = process.env.JWT_SECRET || "dev-secret";
            const requestedEmpresaId = req.query.empresaId;
            const resolveEmpresaId = async () => {
                if (requestedEmpresaId) {
                    return requestedEmpresaId;
                }
                if (process.env.DEMO_EMPRESA_ID) {
                    return process.env.DEMO_EMPRESA_ID;
                }
                try {
                    const prisma = require("../../../shared/database/prisma");
                    const empresa = await prisma.empresa.findFirst({ orderBy: { createdAt: "desc" } });
                    return empresa?.id || "empresa-demo";
                }
                catch (error) {
                    return "empresa-demo";
                }
            };
            resolveEmpresaId().then((empresaId) => {
                const token = jwt.sign({
                    empresaId,
                    usuarioId: "user-demo",
                }, secret, { expiresIn: "12h" });
                res.json({ success: true, data: { token, empresaId } });
            });
        });
        this.app.get("/health", (req, res) => {
            res.json({ success: true, message: "API Health OK" });
        });
        // 404
        this.app.use((req, res) => {
            res.status(404).json({ success: false, error: "Ruta no encontrada" });
        });
        // Middleware de manejo de errores (al final)
        this.app.use(manejarErrores);
    }
    listen(port = 3000) {
        this.app.listen(port, () => {
            console.log(`API servidor escuchando en puerto ${port}`);
        });
    }
}
module.exports = ExpressApp;
//# sourceMappingURL=ExpressApp.js.map