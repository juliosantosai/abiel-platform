declare const express: any;
declare const ApiHttpException: any;
declare const registerApiPipeline: any;
declare const corsMiddleware: any;
declare const manejarErrores: any;
declare const crearRateLimiter: any;
declare const registerRuntimeHttpRoutes: any;
declare class ExpressApp {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase, crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase, bloquearConversacionUseCase, cerrarConversacionUseCase, obtenerMetricasGlobalesUseCase, obtenerActividadRecienteUseCase, }?: {}, extra?: {});
    listen(port?: number): void;
}
//# sourceMappingURL=ExpressApp.d.ts.map