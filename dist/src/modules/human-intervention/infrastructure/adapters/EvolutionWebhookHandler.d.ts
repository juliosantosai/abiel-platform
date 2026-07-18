declare const EvolutionWebhookAdapter: any;
declare const DetectarIntervencionHumanaUseCase: any;
declare const CrearConversationSessionUseCase: any;
/**
 * EvolutionWebhookHandler
 *
 * Orquesta la recepción de un webhook de Evolution API:
 *   1. Normaliza el payload con el adapter.
 *   2. Busca o crea la sesión de conversación.
 *   3. Si el remitente es HUMAN, dispara DetectarIntervencionHumana.
 *
 * No contiene lógica de dominio.
 */
declare class EvolutionWebhookHandler {
    constructor({ repository, eventPublisher, uuidFn, botNumbers }: {
        repository: any;
        eventPublisher: any;
        uuidFn: any;
        botNumbers?: any[];
    });
    handle(payload: any): Promise<{
        session: any;
        comando: any;
    }>;
}
//# sourceMappingURL=EvolutionWebhookHandler.d.ts.map