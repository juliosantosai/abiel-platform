declare const NotFoundError: any;
declare class ConversationSessionRepository {
    guardar(session: any): Promise<void>;
    buscarPorId(id: any): Promise<void>;
    buscarPorClienteYEmpresa(clienteId: any, empresaId: any): Promise<void>;
    buscarPorEmpresaId(empresaId: any): Promise<void>;
    actualizar(session: any): Promise<void>;
    eliminar(id: any): Promise<void>;
}
//# sourceMappingURL=ConversationSessionRepository.d.ts.map