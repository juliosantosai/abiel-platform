declare const ConversationFlowRepository: any;
declare class FakeConversationFlowRepository extends ConversationFlowRepository {
    constructor();
    guardar(flow: any): Promise<any>;
    buscarPorId(id: any): Promise<any>;
    buscarPorConversacion(conversationId: any, empresaId: any): Promise<any>;
    actualizar(flow: any): Promise<any>;
}
//# sourceMappingURL=FakeConversationFlowRepository.d.ts.map