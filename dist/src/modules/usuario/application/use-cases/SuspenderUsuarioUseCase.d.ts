declare const NotFoundError: any;
declare const TenantGuard: any;
declare const UsuarioSuspendido: any;
declare class SuspenderUsuarioUseCase {
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
//# sourceMappingURL=SuspenderUsuarioUseCase.d.ts.map