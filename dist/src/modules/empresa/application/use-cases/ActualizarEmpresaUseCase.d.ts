declare const NotFoundError: any;
declare const TenantGuard: any;
declare const EmpresaActualizada: any;
declare class ActualizarEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher, tenantGuard }: {
        empresaRepository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ id, nombre, tenantContext }: {
        id: any;
        nombre: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=ActualizarEmpresaUseCase.d.ts.map