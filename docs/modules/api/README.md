# Módulo API

## Propósito

Capa de entrada HTTP para operaciones administrativas del sistema. Expone endpoints REST para que dashboards, integraciones externas y CLIs puedan interactuar con los módulos de negocio.

**Responsabilidad única:** traducir requests HTTP en llamadas a use cases y devolver respuestas estandarizadas.

---

## Principios

- Los controllers **no** contienen lógica de negocio.
- Toda validación de entrada se hace antes de llamar al use case.
- Los errores del dominio se mapean a códigos HTTP apropiados.
- Cada endpoint requiere autenticación y valida el tenant del operador.

---

## Endpoints planificados

### Empresa

| Método | Ruta | Use case |
|--------|------|----------|
| POST | `/api/empresas` | `CrearEmpresaUseCase` |
| GET | `/api/empresas/:id` | Consulta directa |
| PUT | `/api/empresas/:id` | `ActualizarEmpresaUseCase` |
| POST | `/api/empresas/:id/activar` | `ActivarEmpresaUseCase` |
| POST | `/api/empresas/:id/suspender` | `SuspenderEmpresaUseCase` |
| POST | `/api/empresas/:id/cancelar` | `CancelarEmpresaUseCase` |

### Usuario

| Método | Ruta | Use case |
|--------|------|----------|
| POST | `/api/usuarios` | `CrearUsuarioUseCase` |
| GET | `/api/usuarios/:id` | Consulta directa |
| PUT | `/api/usuarios/:id` | `ActualizarUsuarioUseCase` |
| POST | `/api/usuarios/:id/activar` | `ActivarUsuarioUseCase` |
| POST | `/api/usuarios/:id/suspender` | `SuspenderUsuarioUseCase` |
| POST | `/api/usuarios/:id/cancelar` | `CancelarUsuarioUseCase` |

### Conversation Control

| Método | Ruta | Use case |
|--------|------|----------|
| POST | `/api/conversaciones/:id/bloquear` | `BloquearConversacionUseCase` |
| POST | `/api/conversaciones/:id/cerrar` | `CerrarConversacionUseCase` |

---

## Mapeo de errores

| Error del dominio | HTTP Status |
|-------------------|-------------|
| `ValidationError` | 400 Bad Request |
| `NotFoundError` | 404 Not Found |
| `DomainError` | 422 Unprocessable Entity |
| `TenantError` | 403 Forbidden |
| Error genérico | 500 Internal Server Error |

---

## Formato de respuesta estándar

**Éxito:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "error": "Mensaje de error", "fields": { ... } }
```

---

## Autenticación y tenant context

Cada request autenticado incluye el `empresaId` del operador. El controller extrae este valor y lo pasa como `tenantContext` al use case correspondiente para que `TenantGuard` pueda validar el aislamiento.

---

## Tecnología

- **Framework:** Express.js (o similar, a definir)
- **Middleware:** autenticación JWT, extracción de tenant, manejo centralizado de errores
