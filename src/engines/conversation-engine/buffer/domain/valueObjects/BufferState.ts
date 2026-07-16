import { ValidationError } from "../../../../../shared/errors/ValidationError";

export type BufferStateValue = "COLLECTING" | "READY" | "FLUSHED";

export class BufferState {
  static VALID: BufferStateValue[] = ["COLLECTING", "READY", "FLUSHED"];

  value: BufferStateValue;

  constructor(value: string) {
    if (!value || typeof value !== "string") {
      throw new ValidationError("El estado del buffer es obligatorio.", { estado: "required" });
    }
    const v = value.toUpperCase() as BufferStateValue;
    if (!BufferState.VALID.includes(v)) {
      throw new ValidationError(`El estado "${value}" no es valido para un buffer.`, { estado: "invalid" });
    }
    this.value = v;
  }

  equals(other: BufferState | string): boolean {
    return this.value === (other instanceof BufferState ? other.value : other);
  }

  toString(): string {
    return this.value;
  }
}
