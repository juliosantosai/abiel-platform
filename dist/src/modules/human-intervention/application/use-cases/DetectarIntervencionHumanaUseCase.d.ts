declare const NotFoundError: any;
declare const HumanInterventionDetected: any;
declare const TenantGuard: any;
declare class DetectarIntervencionHumanaUseCase {
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
//# sourceMappingURL=DetectarIntervencionHumanaUseCase.d.ts.map