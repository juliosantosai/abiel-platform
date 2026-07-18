declare const NotFoundError: any;
declare const ConversationLocked: any;
declare const TenantGuard: any;
declare class BloquearConversacionUseCase {
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
//# sourceMappingURL=BloquearConversacionUseCase.d.ts.map