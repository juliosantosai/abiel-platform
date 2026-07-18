declare const RuntimeBootstrap: any;
declare const PrismaDashboardRepository: any;
declare const ObtenerMetricasGlobales: any;
declare const ObtenerActividadReciente: any;
declare function buildMockUseCases(): {
    crearEmpresaUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    actualizarEmpresaUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    activarEmpresaUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    suspenderEmpresaUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    cancelarEmpresaUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    crearUsuarioUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    actualizarUsuarioUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    activarUsuarioUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    suspenderUsuarioUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    cancelarUsuarioUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    bloquearConversacionUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    cerrarConversacionUseCase: {
        execute: () => Promise<{
            ok: boolean;
        }>;
    };
    obtenerMetricasGlobalesUseCase: any;
    obtenerActividadRecienteUseCase: any;
};
declare function run(): void;
//# sourceMappingURL=runApiMock.d.ts.map