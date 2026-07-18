const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../contracts");
const ApiHttpException = require("../errors/ApiHttpException");
const { registerApiPipeline } = require("../middleware/pipeline");
const { getApiV1Paths } = require("../versioning/ApiVersioning");
const { health } = require("../health/healthController");
const { getOpenApiJson, getOpenApiYaml, getSwaggerUi } = require("../openapi/OpenApiController");
const EmpresaController = require("../interfaces/controllers/EmpresaController");
const UsuarioController = require("../interfaces/controllers/UsuarioController");
const ConversationControlController = require("../interfaces/controllers/ConversationControlController");
const DashboardController = require("../interfaces/controllers/DashboardController");
const { crearRutasEmpresas } = require("../interfaces/routes/empresasRoutes");
const { crearRutasUsuarios } = require("../interfaces/routes/usuariosRoutes");
const { crearRutasConversaciones } = require("../interfaces/routes/conversacionesRoutes");
const { crearRutasDashboard } = require("../interfaces/routes/dashboardRoutes");
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
        registerApiPipeline(this.app, { rateLimiter: apiLimiter });

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

        // Montar rutas v1 (incluye alias /api para compatibilidad)
        const apiV1Paths = getApiV1Paths();
        apiV1Paths.forEach((basePath) => {
            this.app.use(`${basePath}/empresas`, crearRutasEmpresas(empresaController));
            this.app.use(`${basePath}/usuarios`, crearRutasUsuarios(usuarioController));
            this.app.use(`${basePath}/conversaciones`, crearRutasConversaciones(conversationControlController));
            this.app.use(`${basePath}/dashboard`, autenticar, crearRutasDashboard(dashboardController));
        });

        // Health check
        this.app.get("/", (req, res) => {
            res.json(ApiResponse.ok({ req, data: { message: "API Root OK" } }));
        });

        this.app.get("/dashboard", (req, res) => {
            res.sendFile(path.resolve(__dirname, "../interfaces/web/dashboard.html"));
        });

        const demoTokenHandler = (req, res) => {
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
                } catch (error) {
                    return "empresa-demo";
                }
            };

            resolveEmpresaId().then((empresaId) => {
                const token = jwt.sign(
                    {
                        empresaId,
                        usuarioId: "user-demo",
                    },
                    secret,
                    { expiresIn: "12h" }
                );

                res.json(ApiResponse.ok({ req, data: { token, empresaId } }));
            });
        };

        this.app.get("/api/demo-token", demoTokenHandler);
        this.app.get("/api/v1/demo-token", demoTokenHandler);

        this.app.get("/health", health);
        this.app.get("/api/internal/health", health);

        this.app.get("/api/openapi.json", getOpenApiJson);
        this.app.get("/api/v1/openapi.json", getOpenApiJson);
        this.app.get("/api/openapi.yaml", getOpenApiYaml);
        this.app.get("/api/v1/openapi.yaml", getOpenApiYaml);
        this.app.get("/api/internal/docs", getSwaggerUi);

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
            console.log(`API servidor escuchando en puerto ${port}`);
        });
    }
}

module.exports = ExpressApp;
