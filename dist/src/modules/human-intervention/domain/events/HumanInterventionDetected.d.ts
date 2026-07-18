declare const DomainEvent: any;
declare class HumanInterventionDetected extends DomainEvent {
    static eventName: string;
    constructor({ conversationId, empresaId, estadoAnterior, estadoNuevo }: {
        conversationId: any;
        empresaId: any;
        estadoAnterior: any;
        estadoNuevo: any;
    });
}
//# sourceMappingURL=HumanInterventionDetected.d.ts.map