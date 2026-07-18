declare const NotFoundError: any;
declare const BufferProcesado: any;
declare class ProcesarBufferUseCase {
    constructor({ repository, eventPublisher }: {
        repository: any;
        eventPublisher: any;
    });
    execute({ bufferId }: {
        bufferId: any;
    }): Promise<any>;
}
//# sourceMappingURL=ProcesarBufferUseCase.d.ts.map