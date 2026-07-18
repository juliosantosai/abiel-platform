declare const UsuarioCreado: any;
declare const TenantGuard: any;
declare class CrearUsuarioUseCase {
    constructor({ usuarioRepository, eventPublisher, tenantGuard }: {
        usuarioRepository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ id, empresaId, nombre, email, rol, tenantContext }: {
        id: any;
        empresaId: any;
        nombre: any;
        email: any;
        rol: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=CrearUsuarioUseCase.d.ts.map