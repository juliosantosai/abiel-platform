declare const ConversationSession: any;
declare const ConversationCreated: any;
declare const TenantGuard: any;
declare class CrearConversationSessionUseCase {
    constructor({ repository, eventPublisher, tenantGuard }: {
        repository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ id, empresaId, clienteId, tenantContext }: {
        id: any;
        empresaId: any;
        clienteId: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=CrearConversationSessionUseCase.d.ts.map