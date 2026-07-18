declare const NotFoundError: any;
declare const TenantGuard: any;
declare const EmpresaSuspendida: any;
declare class SuspenderEmpresaUseCase {
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
//# sourceMappingURL=SuspenderEmpresaUseCase.d.ts.map