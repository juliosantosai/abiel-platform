declare const NotFoundError: any;
declare const BufferListo: any;
declare class CerrarBufferUseCase {
    constructor({ repository, eventPublisher }: {
        repository: any;
        eventPublisher: any;
    });
    execute({ bufferId }: {
        bufferId: any;
    }): Promise<any>;
}
//# sourceMappingURL=CerrarBufferUseCase.d.ts.map