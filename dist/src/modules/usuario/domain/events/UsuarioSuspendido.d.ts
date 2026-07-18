declare const DomainEvent: any;
declare class UsuarioSuspendido extends DomainEvent {
    static eventName: string;
    constructor({ usuarioId, empresaId, estado }: {
        usuarioId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=UsuarioSuspendido.d.ts.map