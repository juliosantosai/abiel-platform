declare const NotFoundError: any;
declare const EtapaAvanzada: any;
declare class AvanzarEtapaUseCase {
    constructor({ repository, eventPublisher }: {
        repository: any;
        eventPublisher: any;
    });
    execute({ flowId, nuevaEtapa }: {
        flowId: any;
        nuevaEtapa: any;
    }): Promise<any>;
}
//# sourceMappingURL=AvanzarEtapaUseCase.d.ts.map