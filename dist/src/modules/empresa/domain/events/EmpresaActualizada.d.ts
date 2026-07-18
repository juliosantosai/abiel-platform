declare const DomainEvent: any;
declare class EmpresaActualizada extends DomainEvent {
    static eventName: string;
    constructor({ empresaId, nombre }: {
        empresaId: any;
        nombre: any;
    });
}
//# sourceMappingURL=EmpresaActualizada.d.ts.map