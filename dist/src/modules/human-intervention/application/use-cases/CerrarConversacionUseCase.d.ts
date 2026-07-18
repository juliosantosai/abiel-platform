declare const NotFoundError: any;
declare const ConversationClosed: any;
declare const TenantGuard: any;
declare class CerrarConversacionUseCase {
    constructor({ repository, eventPublisher, tenantGuard }: {
        repository: any;
        eventPublisher: any;
        tenantGuard?: TenantGuard;
    });
    execute({ conversationId, tenantContext }: {
        conversationId: any;
        tenantContext: any;
    }): Promise<any>;
}
//# sourceMappingURL=CerrarConversacionUseCase.d.ts.map