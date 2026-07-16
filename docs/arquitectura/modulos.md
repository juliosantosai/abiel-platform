# Modulos del sistema

## Estado por dominio/capa

### Core (framework kernel)

- Capability: en `src/core/capability`
- Execution policy: en `src/core/execution-policy`
- Event kernel: en `src/core/kernel/events`
- Tenant/security: en `src/core/security`

### Engines (orquestacion)

- Agent runtime: `src/engines/agent-runtime`
- Conversation engine (buffer + state machine): `src/engines/conversation-engine`
- AI engine (application/domain): `src/engines/ai-engine`

### Modules (bounded contexts)

Activos de negocio:

- `empresa`
- `usuario`
- `human-intervention`
- `dashboard` (dominio/application)
- `whatsapp-sender`

Compatibilidad V1 (wrappers legacy mantenidos):

- `runtime`
- `execution-policy`
- `capability`
- `ai`
- `buffer`
- `state-machine`
- `api` (wrappers hacia infrastructure)

---

## Bounded context map

```
Empresa ─────────────────── tenant raíz
   │
   ├── Usuario ─────────────── identidad, roles, estados
   │
   ├── Conversation Control ── quién responde
   │       │
   │       └── Buffer ──────── acumulación de mensajes
   │
   └── AI ──────────────────── generación de respuestas
           │
           └── WhatsApp Sender ─ envío de mensajes
```

## Reglas de comunicación entre módulos

- Los módulos **no** acceden directamente a la entidad interna de otro.
- Comunicación **síncrona**: un módulo llama a un use case público de otro.
- Comunicación **asíncrona**: un módulo publica un evento; otros módulos suscriben.
- Los **eventos de dominio** son el mecanismo principal de desacoplamiento.

## Regla adicional post-hardening

Toda comunicacion entre capas debe respetar las reglas de dependencia y pasar por architecture fitness checks en CI.
