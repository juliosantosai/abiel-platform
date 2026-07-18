declare const MessageBufferRepository: any;
declare const MessageBuffer: any;
declare class FakeMessageBufferRepository extends MessageBufferRepository {
    constructor();
    guardar(buffer: any): Promise<any>;
    buscarPorId(id: any): Promise<any>;
    buscarActivo(conversationId: any, empresaId: any): Promise<any>;
    buscarExpirados(ahora: any): Promise<unknown[]>;
    actualizar(buffer: any): Promise<any>;
}
//# sourceMappingURL=FakeMessageBufferRepository.d.ts.map