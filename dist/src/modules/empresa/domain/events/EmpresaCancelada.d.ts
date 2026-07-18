declare const DomainEvent: any;
declare class EmpresaCancelada extends DomainEvent {
    static eventName: string;
    constructor({ empresaId, estado }: {
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=EmpresaCancelada.d.ts.map