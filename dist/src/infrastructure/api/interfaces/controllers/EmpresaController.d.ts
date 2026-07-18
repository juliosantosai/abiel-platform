declare const ApiResponse: any;
declare const toEmpresaDto: any;
declare const validateCrearEmpresa: any, validateActualizarEmpresa: any, validateEmpresaId: any;
declare class EmpresaController {
    constructor({ crearEmpresaUseCase, actualizarEmpresaUseCase, activarEmpresaUseCase, suspenderEmpresaUseCase, cancelarEmpresaUseCase }: {
        crearEmpresaUseCase: any;
        actualizarEmpresaUseCase: any;
        activarEmpresaUseCase: any;
        suspenderEmpresaUseCase: any;
        cancelarEmpresaUseCase: any;
    });
    crear(req: any, res: any, next: any): Promise<any>;
    actualizar(req: any, res: any, next: any): Promise<any>;
    activar(req: any, res: any, next: any): Promise<any>;
    suspender(req: any, res: any, next: any): Promise<any>;
    cancelar(req: any, res: any, next: any): Promise<any>;
}
//# sourceMappingURL=EmpresaController.d.ts.map