declare const DomainEvent: any;
declare class UsuarioCreado extends DomainEvent {
    static eventName: string;
    constructor({ usuarioId, empresaId, estado }: {
        usuarioId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=UsuarioCreado.d.ts.map