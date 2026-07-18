/**
 * Value Object: MetricasConversacion
 * Representa conteos de conversaciones por estado
 */
declare class MetricasConversacion {
    constructor({ total, INICIADA, EN_PROGRESO, FINALIZADA, BLOQUEADA }?: {
        total?: number;
        INICIADA?: number;
        EN_PROGRESO?: number;
        FINALIZADA?: number;
        BLOQUEADA?: number;
    });
    validate(data: any): void;
    static desde(datos: any): MetricasConversacion;
    toJSON(): {
        total: any;
        INICIADA: any;
        EN_PROGRESO: any;
        FINALIZADA: any;
        BLOQUEADA: any;
    };
}
//# sourceMappingURL=MetricasConversacion.d.ts.map