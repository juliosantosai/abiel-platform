declare const DomainEvent: any;
declare class EmpresaActivada extends DomainEvent {
    static eventName: string;
    constructor({ empresaId, estado }: {
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=EmpresaActivada.d.ts.map