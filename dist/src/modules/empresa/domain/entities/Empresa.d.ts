declare const NombreEmpresa: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class Empresa {
    constructor({ id, nombre, email, telefono, whatsappInstanceId, estado, plan, createdAt, updatedAt }: {
        id: any;
        nombre: any;
        email?: any;
        telefono?: any;
        whatsappInstanceId?: any;
        estado?: string;
        plan?: string;
        createdAt?: Date;
        updatedAt?: Date;
    });
    actualizarNombre(nombre: any): void;
    cambiarPlan(plan: any): void;
    asignarWhatsappInstance(instanceId: any): void;
    quitarWhatsappInstance(): void;
    activar(): void;
    suspender(): void;
    cancelar(): void;
    eliminar(): void;
}
//# sourceMappingURL=Empresa.d.ts.map