declare const CerrarBufferUseCase: any;
declare class BufferExpirationWorker {
    constructor({ repository, eventPublisher }: {
        repository: any;
        eventPublisher: any;
    });
    run(ahora?: Date): Promise<any[]>;
}
//# sourceMappingURL=BufferExpirationWorker.d.ts.map