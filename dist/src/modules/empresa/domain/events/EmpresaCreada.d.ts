declare const DomainEvent: any;
declare class EmpresaCreada extends DomainEvent {
    static eventName: string;
    constructor({ empresaId, nombre, estado }: {
        empresaId: any;
        nombre: any;
        estado: any;
    });
}
//# sourceMappingURL=EmpresaCreada.d.ts.map