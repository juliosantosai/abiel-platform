declare const DomainEvent: any;
declare class UsuarioActualizado extends DomainEvent {
    static eventName: string;
    constructor({ usuarioId, empresaId, estado }: {
        usuarioId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=UsuarioActualizado.d.ts.map