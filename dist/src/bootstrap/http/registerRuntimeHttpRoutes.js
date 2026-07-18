"use strict";
const path = require('path');
const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../../infrastructure/api/contracts');
const { getApiV1Paths } = require('../../infrastructure/api/versioning/ApiVersioning');
const { health } = require('../../infrastructure/api/health/healthController');
const { getOpenApiJson, getOpenApiYaml, getSwaggerUi } = require('../../infrastructure/api/openapi/OpenApiController');
const EmpresaController = require('../../infrastructure/api/interfaces/controllers/EmpresaController');
const UsuarioController = require('../../infrastructure/api/interfaces/controllers/UsuarioController');
const ConversationControlController = require('../../infrastructure/api/interfaces/controllers/ConversationControlController');
const DashboardController = require('../../infrastructure/api/interfaces/controllers/DashboardController');
const { crearRutasEmpresas } = require('../../infrastructure/api/interfaces/routes/empresasRoutes');
const { crearRutasUsuarios } = require('../../infrastructure/api/interfaces/routes/usuariosRoutes');
const { crearRutasConversaciones } = require('../../infrastructure/api/interfaces/routes/conversacionesRoutes');
const { crearRutasDashboard } = require('../../infrastructure/api/interfaces/routes/dashboardRoutes');
const { autenticar } = require('../../infrastructure/api/interfaces/middleware/auth');
const { crearRutasAdmin } = require('../../api/routes/admin.routes');
const { crearRutasCustomer } = require('../../api/routes/customer.routes');
const { crearRutasCore } = require('../../api/routes/core.routes');
const { crearRutasPublic } = require('../../api/routes/public.routes');
const { adminAuth } = require('../../api/middleware/adminAuth');
function registerRuntimeHttpRoutes(app, useCases = {}, extra = {}) {
    const { crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase, crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase, bloquearConversacionUseCase, cerrarConversacionUseCase, obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase, } = useCases;
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
    getApiV1Paths().forEach((basePath) => {
        app.use(`${basePath}/empresas`, crearRutasEmpresas(empresaController));
        app.use(`${basePath}/usuarios`, crearRutasUsuarios(usuarioController));
        app.use(`${basePath}/conversaciones`, crearRutasConversaciones(conversationControlController));
        app.use(`${basePath}/dashboard`, autenticar, crearRutasDashboard(dashboardController));
        app.use(`${basePath}/customer`, crearRutasCustomer(extra));
        app.use(`${basePath}/core`, adminAuth, crearRutasCore(extra));
        app.use(`${basePath}/public`, crearRutasPublic(extra));
    });
    app.get('/', (req, res) => {
        res.json(ApiResponse.ok({ req, data: { message: 'API Root OK' } }));
    });
    app.get('/dashboard', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../infrastructure/api/interfaces/web/dashboard.html'));
    });
    app.get('/dashboard/internals', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../infrastructure/api/interfaces/web/internal-dashboard.html'));
    });
    app.get('/api/internal/overview', (req, res) => {
        res.json(ApiResponse.ok({
            req,
            data: {
                server: 'Abiel Core',
                generatedAt: new Date().toISOString(),
                sections: [
                    {
                        id: 'core',
                        title: 'Core',
                        description: 'Kernel reusable del framework',
                        items: [
                            { name: 'EventBus', status: 'active' },
                            { name: 'EventPublisher', status: 'active' },
                            { name: 'Capability', status: 'active' },
                            { name: 'TenantContext', status: 'active' },
                            { name: 'PermissionChecker', status: 'active' },
                        ],
                    },
                    {
                        id: 'engines',
                        title: 'Engines',
                        description: 'Motores de ejecución y conversación',
                        items: [
                            { name: 'Agent Runtime', status: 'active' },
                            { name: 'AI Engine', status: 'active' },
                            { name: 'Conversation Engine', status: 'active' },
                        ],
                    },
                    {
                        id: 'modules',
                        title: 'Modules',
                        description: 'Módulos de negocio del servidor',
                        items: [
                            { name: 'Empresa', status: 'active' },
                            { name: 'Usuario', status: 'active' },
                            { name: 'Human Intervention', status: 'active' },
                            { name: 'WhatsApp Sender', status: 'active' },
                            { name: 'Dashboard', status: 'active' },
                        ],
                    },
                    {
                        id: 'infrastructure',
                        title: 'Infrastructure',
                        description: 'API, middleware y adaptadores',
                        items: [
                            { name: 'Express API', status: 'active' },
                            { name: 'Auth Middleware', status: 'active' },
                            { name: 'Rate Limiter', status: 'active' },
                            { name: 'OpenAPI Docs', status: 'active' },
                            { name: 'Health Endpoint', status: 'active' },
                        ],
                    },
                    {
                        id: 'shared',
                        title: 'Shared',
                        description: 'Servicios compartidos de soporte',
                        items: [
                            { name: 'Logger', status: 'active' },
                            { name: 'Errors', status: 'active' },
                            { name: 'Prisma', status: 'active' },
                            { name: 'Config', status: 'active' },
                        ],
                    },
                ],
            },
        }));
    });
    const demoTokenHandler = (req, res) => {
        const secret = process.env.JWT_SECRET || 'dev-secret';
        const requestedEmpresaId = req.query.empresaId;
        const resolveEmpresaId = async () => {
            if (requestedEmpresaId) {
                return requestedEmpresaId;
            }
            if (process.env.DEMO_EMPRESA_ID) {
                return process.env.DEMO_EMPRESA_ID;
            }
            try {
                const prisma = require('../../shared/database/prisma');
                const empresa = await prisma.empresa.findFirst({ orderBy: { createdAt: 'desc' } });
                return empresa?.id || 'empresa-demo';
            }
            catch (error) {
                return 'empresa-demo';
            }
        };
        resolveEmpresaId().then((empresaId) => {
            const token = jwt.sign({
                empresaId,
                usuarioId: 'user-demo',
            }, secret, { expiresIn: '12h' });
            res.json(ApiResponse.ok({ req, data: { token, empresaId } }));
        });
    };
    app.get('/api/demo-token', demoTokenHandler);
    app.get('/api/v1/demo-token', demoTokenHandler);
    app.get('/health', health);
    app.get('/api/internal/health', health);
    app.get('/api/openapi.json', getOpenApiJson);
    app.get('/api/v1/openapi.json', getOpenApiJson);
    app.get('/api/openapi.yaml', getOpenApiYaml);
    app.get('/api/v1/openapi.yaml', getOpenApiYaml);
    app.get('/api/internal/docs', getSwaggerUi);
    const adminOptions = {
        runtimeEngine: extra.runtimeEngine,
        eventBus: extra.eventBus,
        abielCore: extra.abielCore,
        metrics: extra.metrics,
        logBuffer: extra.logBuffer,
        moduleRegistry: extra.moduleRegistry,
        pluginRegistry: extra.pluginRegistry,
    };
    app.use('/api/admin', adminAuth, crearRutasAdmin(adminOptions));
}
module.exports = { registerRuntimeHttpRoutes };
//# sourceMappingURL=registerRuntimeHttpRoutes.js.map