declare const ApiResponse: any;
declare const toUsuarioDto: any;
declare const validateCrearUsuario: any, validateActualizarUsuario: any, validateUsuarioId: any;
declare class UsuarioController {
    constructor({ crearUsuarioUseCase, actualizarUsuarioUseCase, activarUsuarioUseCase, suspenderUsuarioUseCase, cancelarUsuarioUseCase }: {
        crearUsuarioUseCase: any;
        actualizarUsuarioUseCase: any;
        activarUsuarioUseCase: any;
        suspenderUsuarioUseCase: any;
        cancelarUsuarioUseCase: any;
    });
    crear(req: any, res: any, next: any): Promise<any>;
    actualizar(req: any, res: any, next: any): Promise<any>;
    activar(req: any, res: any, next: any): Promise<any>;
    suspender(req: any, res: any, next: any): Promise<any>;
    cancelar(req: any, res: any, next: any): Promise<any>;
}
//# sourceMappingURL=UsuarioController.d.ts.map