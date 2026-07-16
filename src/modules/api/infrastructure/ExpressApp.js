const express = require("express");
const EmpresaController = require("../interfaces/controllers/EmpresaController");
const UsuarioController = require("../interfaces/controllers/UsuarioController");
const ConversationControlController = require("../interfaces/controllers/ConversationControlController");
const DashboardController = require("../../dashboard/interfaces/controllers/DashboardController");
const { crearRutasEmpresas } = require("../interfaces/routes/empresasRoutes");
const { crearRutasUsuarios } = require("../interfaces/routes/usuariosRoutes");
const { crearRutasConversaciones } = require("../interfaces/routes/conversacionesRoutes");
const { crearRutasDashboard } = require("../../dashboard/interfaces/routes/dashboardRoutes");
const { autenticar, manejarErrores } = require("../interfaces/middleware/auth");
const { crearRateLimiter } = require("../interfaces/middleware/rateLimit");

class ExpressApp {
    constructor({
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
    }) {
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
