declare const DomainError: any;
declare const NotFoundError: any;
declare class UsuarioRepository {
    guardar(usuario: any): Promise<void>;
    buscarPorId(id: any): Promise<void>;
    buscarPorEmail(email: any): Promise<void>;
    buscarPorEmpresaId(empresaId: any): Promise<void>;
    obtenerTodos(): Promise<void>;
    actualizar(usuario: any): Promise<void>;
    eliminar(id: any): Promise<void>;
}
//# sourceMappingURL=UsuarioRepository.d.ts.map