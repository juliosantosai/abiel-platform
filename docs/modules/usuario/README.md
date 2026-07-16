# Módulo Usuario

## Propósito

Administra las identidades de las personas que operan dentro de una empresa. Todo usuario pertenece a exactamente una empresa; no existe usuario sin empresa.

---

## Modelo de dominio

**Entidad: Usuario**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID único |
| empresaId | string | Tenant propietario |
| nombre | string | Validado por NombreUsuario |
| email | string | Validado por EmailUsuario (normalizado a minúsculas) |
| rol | string | Validado por RolUsuario |
| estado | string | Estado actual |
| createdAt | Date | Fecha de creación |
| updatedAt | Date | Última actualización |

**Value Objects:**
- `NombreUsuario` — no vacío, no solo espacios
- `EmailUsuario` — formato válido, normalizado a minúsculas
- `RolUsuario` — acepta: `OWNER`, `ADMIN`, `OPERADOR`, `LECTOR`

---

## Roles

| Rol | Descripción |
|-----|-------------|
| OWNER | Propietario principal, máximo nivel, no eliminable si es el único |
| ADMIN | Administrador operativo |
| OPERADOR | Usuario funcional estándar |
| LECTOR | Solo lectura |

---

## Máquina de estados

```
PENDIENTE ──activar()──→ ACTIVO ──suspender()──→ SUSPENDIDO
    │                      │                         │
    └──cancelar()──→    cancelar()──→            cancelar()──→ CANCELADO
```

Reglas adicionales:
- `cambiarRol()` solo desde ACTIVO
- `actualizarNombre()` y `cambiarEmail()` bloqueados desde CANCELADO

---

## Casos de uso

| Use case | Descripción |
|----------|-------------|
| `CrearUsuarioUseCase` | Crea en PENDIENTE, valida tenant, publica `UsuarioCreado` |
| `ActualizarUsuarioUseCase` | Actualiza nombre/email/rol, valida tenant |
| `ActivarUsuarioUseCase` | → ACTIVO, valida tenant |
| `SuspenderUsuarioUseCase` | → SUSPENDIDO, valida tenant |
| `CancelarUsuarioUseCase` | → CANCELADO, valida tenant |

---

## Eventos de dominio

| Evento | Datos |
|--------|-------|
| `UsuarioCreado` | usuarioId, empresaId, estado |
| `UsuarioActualizado` | usuarioId, empresaId, estado |
| `UsuarioActivado` | usuarioId, empresaId, estado |
| `UsuarioSuspendido` | usuarioId, empresaId, estado |
| `UsuarioCancelado` | usuarioId, empresaId, estado |

---

## Repositorios

**Contrato:** `UsuarioRepository`
- `guardar`, `buscarPorId`, `buscarPorEmail`, `buscarPorEmpresaId`, `obtenerTodos`, `actualizar`, `eliminar`

**Implementaciones:**
- `PrismaUsuarioRepository` — persiste en PostgreSQL
- `FakeUsuarioRepository` — Map en memoria para tests

---

## Errores

| Error | Cuándo |
|-------|--------|
| `ValidationError` | email inválido, nombre vacío, rol/estado desconocido |
| `DomainError` | transición de estado no permitida |
| `NotFoundError` | usuario no encontrado en repositorio |
| `TenantError` | recurso pertenece a otro tenant |

---

## Tests

```
npx jest src/modules/usuario --runInBand
```
