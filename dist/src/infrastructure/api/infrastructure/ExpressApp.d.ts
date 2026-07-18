declare const express: any;
declare const path: any;
declare const jwt: any;
declare const ApiResponse: any;
declare const ApiHttpException: any;
declare const registerApiPipeline: any;
declare const getApiV1Paths: any;
declare const health: any;
declare const getOpenApiJson: any, getOpenApiYaml: any, getSwaggerUi: any;
declare const EmpresaController: any;
declare const UsuarioController: any;
declare const ConversationControlController: any;
declare const DashboardController: any;
declare const crearRutasEmpresas: any;
declare const crearRutasUsuarios: any;
declare const crearRutasConversaciones: any;
declare const crearRutasDashboard: any;
declare const autenticar: any, manejarErrores: any;
declare const crearRateLimiter: any;
declare class ExpressApp {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase, crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase, bloquearConversacionUseCase, cerrarConversacionUseCase, obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase, }: {
        crearEmpresaUseCase: any;
        actualizarEmpresaUseCase: any;
        activarEmpresaUseCase: any;
        suspenderEmpresaUseCase: any;
        cancelarEmpresaUseCase: any;
        crearUsuarioUseCase: any;
        actualizarUsuarioUseCase: any;
        activarUsuarioUseCase: any;
        suspenderUsuarioUseCase: any;
        cancelarUsuarioUseCase: any;
        bloquearConversacionUseCase: any;
        cerrarConversacionUseCase: any;
        obtenerMetricasGlobalesUseCase: any;
        obtenerActividadRecienteUseCase: any;
    });
    listen(port?: number): void;
}
//# sourceMappingURL=ExpressApp.d.ts.map