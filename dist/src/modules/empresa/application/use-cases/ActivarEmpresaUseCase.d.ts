declare const NotFoundError: any;
declare const TenantGuard: any;
declare const EmpresaActivada: any;
declare class ActivarEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher, tenantGuard }: {
        empresaRepository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ id, tenantContext }: {
        id: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=ActivarEmpresaUseCase.d.ts.map