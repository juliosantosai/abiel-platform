declare const NombreUsuario: any;
declare const EmailUsuario: any;
declare const RolUsuario: any;
declare const ValidationError: any;
declare const DomainError: any;
declare class Usuario {
    constructor({ id, empresaId, nombre, email, rol, estado, createdAt, updatedAt }: {
        id: any;
        empresaId: any;
        nombre: any;
        email: any;
        rol: any;
        estado?: string;
        createdAt?: Date;
        updatedAt?: Date;
    });
    validarEstado(estado: any): string;
    actualizarNombre(nombre: any): void;
    cambiarEmail(email: any): void;
    cambiarRol(rol: any): void;
    activar(): void;
    suspender(): void;
    cancelar(): void;
}
//# sourceMappingURL=Usuario.d.ts.map