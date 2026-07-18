declare const EmpresaRepository: any;
declare class FakeEmpresaRepository extends EmpresaRepository {
    constructor();
    guardar(empresa: any): Promise<any>;
    buscarPorId(id: any): Promise<any>;
    buscarPorWhatsappInstanceId(instanceId: any): Promise<any>;
    obtenerTodas(): Promise<unknown[]>;
    actualizar(empresa: any): Promise<any>;
    eliminar(id: any): Promise<any>;
}
//# sourceMappingURL=FakeEmpresaRepository.d.ts.map