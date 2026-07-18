declare const NotFoundError: any;
declare const TenantGuard: any;
declare const EmpresaCancelada: any;
declare class CancelarEmpresaUseCase {
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
//# sourceMappingURL=CancelarEmpresaUseCase.d.ts.map