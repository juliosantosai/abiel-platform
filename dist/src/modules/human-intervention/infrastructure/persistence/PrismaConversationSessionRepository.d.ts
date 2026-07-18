declare const ConversationSessionRepository: any;
declare const ConversationSession: any;
declare const prisma: any;
declare class PrismaConversationSessionRepository extends ConversationSessionRepository {
    #private;
    guardar(session: any): Promise<any>;
    buscarPorId(id: any): Promise<any>;
    buscarPorClienteYEmpresa(clienteId: any, empresaId: any): Promise<any>;
    buscarPorEmpresaId(empresaId: any): Promise<any>;
    actualizar(session: any): Promise<any>;
    eliminar(id: any): Promise<any>;
}
//# sourceMappingURL=PrismaConversationSessionRepository.d.ts.map