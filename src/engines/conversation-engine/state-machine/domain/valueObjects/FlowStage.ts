import { ValidationError } from "../../../../../shared/errors/ValidationError";

export const ETAPAS_DEFAULT = [
  "SALUDO",
  "CALIFICACION",
  "PRESENTACION",
  "NEGOCIACION",
  "CIERRE",
  "POSTVENTA",
  "SOPORTE",
  "FINALIZADO",
] as const;

export type FlowStageValue = (typeof ETAPAS_DEFAULT)[number];

export class FlowStage {
  value: FlowStageValue;

  constructor(value: string, etapasValidas: readonly string[] = ETAPAS_DEFAULT) {
    if (!value || typeof value !== "string") {
      throw new ValidationError("La etapa es obligatoria.", { etapa: "required" });
    }
    const v = value.toUpperCase();
    if (!etapasValidas.includes(v)) {
      throw new ValidationError(`La etapa "${value}" no es valida.`, { etapa: "invalid" });
    }
    this.value = v as FlowStageValue;
  }

  static get DEFAULT_STAGES(): readonly string[] {
    return ETAPAS_DEFAULT;
  }

  equals(other: FlowStage | string): boolean {
    return this.value === (other instanceof FlowStage ? other.value : other);
  }

  toString(): string {
    return this.value;
  }
}
