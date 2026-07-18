declare const NotFoundError: any;
declare const TenantGuard: any;
declare const UsuarioActualizado: any;
declare class ActualizarUsuarioUseCase {
    constructor({ usuarioRepository, eventPublisher, tenantGuard }: {
        usuarioRepository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ id, nombre, email, rol, tenantContext }: {
        id: any;
        nombre: any;
        email: any;
        rol: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=ActualizarUsuarioUseCase.d.ts.map