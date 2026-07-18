declare const ValidationError: any;
declare const ETAPAS_DEFAULT: string[];
declare class FlowStage {
    constructor(value: any, etapasValidas?: string[]);
    static get DEFAULT_STAGES(): string[];
    equals(other: any): boolean;
    toString(): any;
}
//# sourceMappingURL=FlowStage.d.ts.map