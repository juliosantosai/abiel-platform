/**
 * Value Object: MetricasUsuario
 * Representa conteos de usuarios por rol
 */
declare class MetricasUsuario {
    constructor({ total, ADMIN, SUPERVISOR, AGENTE, CLIENTE }?: {
        total?: number;
        ADMIN?: number;
        SUPERVISOR?: number;
        AGENTE?: number;
        CLIENTE?: number;
    });
    validate(data: any): void;
    static desde(datos: any): MetricasUsuario;
    toJSON(): {
        total: any;
        ADMIN: any;
        SUPERVISOR: any;
        AGENTE: any;
        CLIENTE: any;
    };
}
//# sourceMappingURL=MetricasUsuario.d.ts.map