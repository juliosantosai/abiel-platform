declare const NotFoundError: any;
declare const TenantGuard: any;
declare const UsuarioCancelado: any;
declare class CancelarUsuarioUseCase {
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
//# sourceMappingURL=CancelarUsuarioUseCase.d.ts.map