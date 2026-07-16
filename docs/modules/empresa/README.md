# Módulo Empresa

## Propósito

Tenant raíz del sistema. Representa a cada cliente SaaS. Todos los demás recursos (usuarios, conversaciones) pertenecen a una empresa.

---

## Modelo de dominio

**Entidad: Empresa**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| nombre | string | Nombre de la empresa |
| email | string? | Email de contacto |
| telefono | string? | Teléfono |
| whatsappInstanceId | string? | Instancia Evolution API |
| estado | string | Estado actual |
| plan | string | Plan contratado |
| createdAt | Date | Fecha de creación |
| updatedAt | Date | Última actualización |

**Value Objects:** `NombreEmpresa` (valida que no esté vacío)

---

## Máquina de estados

```
PENDIENTE ──activar()──→ ACTIVA ──suspender()──→ SUSPENDIDA
    │                      │                         │
    └──cancelar()──→    cancelar()──→            cancelar()──→ CANCELADA
```

| Transición | Permitida |
|-----------|-----------|
| PENDIENTE → ACTIVA | ✅ |
| PENDIENTE → CANCELADA | ✅ |
| PENDIENTE → SUSPENDIDA | ❌ |
| ACTIVA → SUSPENDIDA | ✅ |
| ACTIVA → CANCELADA | ✅ |
| SUSPENDIDA → ACTIVA | ✅ |
| SUSPENDIDA → CANCELADA | ✅ |
| CANCELADA → cualquier | ❌ |

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `CrearEmpresaUseCase` | Crea empresa en PENDIENTE, publica `EmpresaCreada` |
| `ActualizarEmpresaUseCase` | Actualiza nombre, valida tenant, publica `EmpresaActualizada` |
| `ActivarEmpresaUseCase` | PENDIENTE/SUSPENDIDA → ACTIVA, publica `EmpresaActivada` |
| `SuspenderEmpresaUseCase` | ACTIVA → SUSPENDIDA, publica `EmpresaSuspendida` |
| `CancelarEmpresaUseCase` | → CANCELADA, publica `EmpresaCancelada` |

Todos los use cases de modificación validan tenant isolation si se provee `tenantContext`.

---

## Eventos de dominio

| Evento | Datos |
|--------|-------|
| `EmpresaCreada` | empresaId, nombre, estado |
| `EmpresaActualizada` | empresaId, nombre |
| `EmpresaActivada` | empresaId, estado |
| `EmpresaSuspendida` | empresaId, estado |
| `EmpresaCancelada` | empresaId, estado |

---

## Repositorios

**Contrato:** `EmpresaRepository`
- `guardar(empresa)`, `buscarPorId(id)`, `actualizar(empresa)`, `obtenerTodos()`

**Implementaciones:**
- `PrismaEmpresaRepository` — persiste en PostgreSQL
- `FakeEmpresaRepository` — Map en memoria para tests

---

## Tests

```
npx jest src/modules/empresa --runInBand
```

Cobertura: entidad, value objects, 5 use cases (comportamiento + NotFoundError + tenant isolation), repositorio Prisma (mocks), repositorio Fake.
