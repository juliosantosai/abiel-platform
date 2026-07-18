declare const EmpresaCreada: any;
declare class CrearEmpresaUseCase {
    constructor({ empresaRepository, eventPublisher }: {
        empresaRepository: any;
        eventPublisher: any;
    });
    execute({ id, nombre, email, telefono, plan }: {
        id: any;
        nombre: any;
        email?: any;
        telefono?: any;
        plan?: string;
    }): Promise<any>;
}
//# sourceMappingURL=CrearEmpresaUseCase.d.ts.map