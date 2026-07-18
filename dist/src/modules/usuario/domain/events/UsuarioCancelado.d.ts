declare const DomainEvent: any;
declare class UsuarioCancelado extends DomainEvent {
    static eventName: string;
    constructor({ usuarioId, empresaId, estado }: {
        usuarioId: any;
        empresaId: any;
        estado: any;
    });
}
//# sourceMappingURL=UsuarioCancelado.d.ts.map