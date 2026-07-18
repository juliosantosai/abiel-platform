/**
 * Value Object: MetricasEmpresa
 * Representa conteos de empresas por estado
 */
declare class MetricasEmpresa {
    constructor({ total, ACTIVA, SUSPENDIDA, CANCELADA, PENDIENTE }: {
        total?: number;
        ACTIVA?: number;
        SUSPENDIDA?: number;
        CANCELADA?: number;
        PENDIENTE?: number;
    });
    validate(data: any): void;
    /**
     * Factory method desde datos de BD
     */
    static desde(datos: any): MetricasEmpresa;
    toJSON(): {
        total: any;
        ACTIVA: any;
        SUSPENDIDA: any;
        CANCELADA: any;
        PENDIENTE: any;
    };
}
//# sourceMappingURL=MetricasEmpresa.d.ts.map