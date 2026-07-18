declare const UsuarioRepository: any;
declare class FakeUsuarioRepository extends UsuarioRepository {
    constructor();
    guardar(usuario: any): Promise<any>;
    buscarPorId(id: any): Promise<any>;
    buscarPorEmail(email: any): Promise<any>;
    buscarPorEmpresaId(empresaId: any): Promise<unknown[]>;
    obtenerTodos(): Promise<unknown[]>;
    actualizar(usuario: any): Promise<any>;
    eliminar(id: any): Promise<any>;
}
//# sourceMappingURL=FakeUsuarioRepository.d.ts.map