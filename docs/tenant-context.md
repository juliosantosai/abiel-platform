# Tenant Context compartido

## Objetivo

Esta capa compartida permite manejar el contexto de tenant de forma reutilizable por Empresa, Usuario y futuros módulos de Abiel Core.

## Componentes

- TenantContext: representa el contexto de un tenant con un identificador y una fuente opcional.
- TenantGuard: valida que exista un contexto activo y que un recurso pertenezca al mismo tenant.
- TenantError: error específico para violaciones de tenant isolation.

## Principios

- No depende de Prisma ni de ningún módulo del dominio.
- Puede usarse desde services, use cases, repositorios o adapters.
- Permite aplicar validaciones de aislamiento de forma centralizada.

## Ejemplo de uso

```js
const TenantGuard = require("../src/shared/tenant/TenantGuard");

const guard = new TenantGuard({ tenantContext: "tenant-1" });
const context = guard.ensureTenantMatches({ empresaId: "tenant-1" });
```
