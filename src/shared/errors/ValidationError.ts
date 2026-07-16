export class ValidationError extends Error {
  fields: Record<string, unknown>;

  constructor(message: string, fields: Record<string, unknown> = {}) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}
