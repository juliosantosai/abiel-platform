# Shared — Tenant

Ver: docs/tenant-context.md (documento principal de tenant isolation)

## TenantContext

Representa el contexto de tenant activo en una operación.

```js
TenantContext.from("empresa-1")
TenantContext.from({ tenantId: "empresa-1", source: "request" })
```

## TenantGuard

Valida que el recurso pertenezca al tenant activo.

```js
const guard = new TenantGuard({ tenantContext: "empresa-1" });
guard.ensureTenantMatches(usuario, tenantContext);
guard.ensureSameTenant(empresaId, tenantContext);
guard.ensureTenantContext(tenantContext);
```

La inferencia de tenant en recursos soporta: `tenantId`, `empresaId`, `tenant.id`

## TenantError

Error lanzado cuando hay violación de aislamiento por tenant.
