declare const UsuarioRepository: any;
declare const prisma: any;
declare const Usuario: any;
declare class PrismaUsuarioRepository extends UsuarioRepository {
    guardar(usuario: any): Promise<any>;
    buscarPorId(id: any): Promise<Usuario>;
    buscarPorEmail(email: any): Promise<Usuario>;
    buscarPorEmpresaId(empresaId: any): Promise<any>;
    obtenerTodos(): Promise<any>;
    actualizar(usuario: any): Promise<any>;
    eliminar(id: any): Promise<any>;
}
//# sourceMappingURL=PrismaUsuarioRepository.d.ts.map