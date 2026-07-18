declare const ConversationSessionRepository: any;
declare const ConversationSession: any;
declare class FakeConversationSessionRepository extends ConversationSessionRepository {
    constructor();
    guardar(session: any): Promise<any>;
    buscarPorId(id: any): Promise<any>;
    buscarPorClienteYEmpresa(clienteId: any, empresaId: any): Promise<any>;
    buscarPorEmpresaId(empresaId: any): Promise<unknown[]>;
    actualizar(session: any): Promise<any>;
    obtenerTodas(): Promise<unknown[]>;
    eliminar(id: any): Promise<any>;
}
//# sourceMappingURL=FakeConversationSessionRepository.d.ts.map