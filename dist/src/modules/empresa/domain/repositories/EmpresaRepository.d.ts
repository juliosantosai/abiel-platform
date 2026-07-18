declare class EmpresaRepository {
    guardar(empresa: any): Promise<void>;
    buscarPorId(id: any): Promise<void>;
    buscarPorWhatsappInstanceId(instanceId: any): Promise<void>;
    obtenerTodas(): Promise<void>;
    actualizar(empresa: any): Promise<void>;
    eliminar(id: any): Promise<void>;
}
//# sourceMappingURL=EmpresaRepository.d.ts.map