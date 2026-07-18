declare const NotFoundError: any;
declare const TenantGuard: any;
declare const UsuarioActivado: any;
declare class ActivarUsuarioUseCase {
    constructor({ usuarioRepository, eventPublisher, tenantGuard }: {
        usuarioRepository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ id, tenantContext }: {
        id: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=ActivarUsuarioUseCase.d.ts.map