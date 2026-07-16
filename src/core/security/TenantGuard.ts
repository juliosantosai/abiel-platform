import { TenantContext, TenantContextInput } from "./TenantContext";
import { TenantError } from "./TenantError";

type TenantContextLike = TenantContext | string | TenantContextInput;

interface TenantScopedResource {
  tenantId?: string;
  empresaId?: string;
  tenant?: {
    id?: string;
  };
}

export class TenantGuard {
  private tenantContext: TenantContext | null;

  constructor({ tenantContext }: { tenantContext?: TenantContextLike } = {}) {
    this.tenantContext = tenantContext ? TenantContext.from(tenantContext) : null;
  }

  setContext(tenantContext: TenantContextLike): void {
    this.tenantContext = TenantContext.from(tenantContext);
  }

  clearContext(): void {
    this.tenantContext = null;
  }

  ensureTenantContext(tenantContext: TenantContextLike | null = this.tenantContext): TenantContext {
    const context = tenantContext ? TenantContext.from(tenantContext) : null;

    if (!context) {
      throw new TenantError("No existe un contexto de tenant activo.");
    }

    return context;
  }

  ensureSameTenant(resourceTenantId: string | undefined, tenantContext: TenantContextLike | null = this.tenantContext): TenantContext {
    const context = this.ensureTenantContext(tenantContext);

    if (resourceTenantId !== context.tenantId) {
      throw new TenantError("El recurso no pertenece al tenant actual.");
    }

    return context;
  }

  ensureTenantMatches(resource: TenantScopedResource | null | undefined, tenantContext: TenantContextLike | null = this.tenantContext): TenantContext {
    if (!resource) {
      throw new TenantError("No se puede validar un recurso nulo.");
    }

    const tenantId = resource.tenantId || resource.empresaId || resource.tenant?.id;
    return this.ensureSameTenant(tenantId, tenantContext);
  }
}
