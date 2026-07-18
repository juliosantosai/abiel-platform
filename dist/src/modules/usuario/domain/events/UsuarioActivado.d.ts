declare const DomainEvent: any;
declare class UsuarioActivado extends DomainEvent {
    static eventName: string;
    constructor({ usuarioId, empresaId, estado }: {
        usuarioId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=UsuarioActivado.d.ts.map