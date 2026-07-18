declare class MessageBufferRepository {
    guardar(buffer: any): Promise<void>;
    buscarPorId(id: any): Promise<void>;
    buscarActivo(conversationId: any, empresaId: any): Promise<void>;
    buscarExpirados(ahora: any): Promise<void>;
    actualizar(buffer: any): Promise<void>;
}
//# sourceMappingURL=MessageBufferRepository.d.ts.map