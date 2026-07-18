declare class ConversationFlowRepository {
    guardar(flow: any): Promise<void>;
    buscarPorId(id: any): Promise<void>;
    buscarPorConversacion(conversationId: any, empresaId: any): Promise<void>;
    actualizar(flow: any): Promise<void>;
}
//# sourceMappingURL=ConversationFlowRepository.d.ts.map