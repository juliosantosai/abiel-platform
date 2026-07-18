declare const DomainEvent: any;
declare class EmpresaSuspendida extends DomainEvent {
    static eventName: string;
    constructor({ empresaId, estado }: {
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=EmpresaSuspendida.d.ts.map