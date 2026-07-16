export interface TenantContextInput {
  tenantId: string;
  source?: string;
}

export class TenantContext {
  tenantId: string;
  source: string;

  constructor({ tenantId, source = "unknown" }: TenantContextInput) {
    if (!tenantId) {
      throw new Error("El tenantId es obligatorio.");
    }

    this.tenantId = tenantId;
    this.source = source;
  }

  static from(value: TenantContext | string | TenantContextInput): TenantContext {
    if (value instanceof TenantContext) {
      return value;
    }

    if (typeof value === "string") {
      return new TenantContext({ tenantId: value, source: "string" });
    }

    if (value && typeof value === "object") {
      return new TenantContext({ tenantId: value.tenantId, source: value.source || "object" });
    }

    throw new Error("No se puede crear un TenantContext a partir del valor proporcionado.");
  }
}
