declare const EmpresaRepository: any;
declare const prisma: any;
declare const Empresa: any;
declare class PrismaEmpresaRepository extends EmpresaRepository {
    guardar(empresa: any): Promise<any>;
    buscarPorId(id: any): Promise<Empresa>;
    buscarPorWhatsappInstanceId(instanceId: any): Promise<Empresa>;
    obtenerTodas(): Promise<any>;
    actualizar(empresa: any): Promise<any>;
    eliminar(id: any): Promise<any>;
}
//# sourceMappingURL=PrismaEmpresaRepository.d.ts.map