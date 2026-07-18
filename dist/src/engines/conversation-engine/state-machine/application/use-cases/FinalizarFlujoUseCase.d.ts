declare const NotFoundError: any;
declare const FlujoFinalizado: any;
declare class FinalizarFlujoUseCase {
    constructor({ repository, eventPublisher }: {
        repository: any;
        eventPublisher: any;
    });
    execute({ flowId }: {
        flowId: any;
    }): Promise<any>;
}
//# sourceMappingURL=FinalizarFlujoUseCase.d.ts.map