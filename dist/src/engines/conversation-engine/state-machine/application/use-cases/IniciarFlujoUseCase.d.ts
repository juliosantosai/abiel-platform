declare const ConversationFlow: any;
declare const FlujoIniciado: any;
declare class IniciarFlujoUseCase {
    constructor({ repository, eventPublisher }: {
        repository: any;
        eventPublisher: any;
    });
    execute({ id, empresaId, conversationId, etapaInicial, etapasValidas }: {
        id: any;
        empresaId: any;
        conversationId: any;
        etapaInicial?: string;
        etapasValidas: any;
    }): Promise<any>;
}
//# sourceMappingURL=IniciarFlujoUseCase.d.ts.map