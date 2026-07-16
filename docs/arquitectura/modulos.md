# Módulos del sistema

## Módulos implementados

### Empresa ✅
Tenant raíz del sistema. Administra información y estado de cada cliente SaaS.

- Entidad: `Empresa`
- Estados: `PENDIENTE → ACTIVA → SUSPENDIDA → CANCELADA`
- Eventos: `EmpresaCreada`, `EmpresaActualizada`, `EmpresaActivada`, `EmpresaSuspendida`, `EmpresaCancelada`
- Tenant isolation: aplicada en Actualizar, Activar, Suspender, Cancelar

### Usuario ✅
Identidades de personas dentro de una empresa.

- Entidad: `Usuario`
- Roles: `OWNER`, `ADMIN`, `OPERADOR`, `LECTOR`
- Estados: `PENDIENTE → ACTIVO → SUSPENDIDO → CANCELADO`
- Eventos: `UsuarioCreado`, `UsuarioActualizado`, `UsuarioActivado`, `UsuarioSuspendido`, `UsuarioCancelado`
- Tenant isolation: aplicada en todos los use cases de modificación

### Conversation Control ✅
Decide quién responde en una conversación: bot o humano.

- Entidad: `ConversationSession`
- Estados: `BOT_ACTIVE → HUMAN_ACTIVE → BOT_RESUME_PENDING → BOT_ACTIVE` / `HUMAN_LOCKED` / `CLOSED`
- Eventos: `ConversationCreated`, `HumanInterventionDetected`, `BotResumed`, `ConversationLocked`, `ConversationClosed`
- Worker: `BotResumptionWorker` evalúa reanudación periódica
- Adapter: `EvolutionWebhookAdapter` traduce webhooks externos

---

## Módulos pendientes

| Módulo | Responsabilidad |
|--------|----------------|
| **Buffer** | Acumula mensajes antes de procesarlos para evitar respuestas fragmentadas |
| **State Machine** | Controla la etapa del flujo de atención dentro de una conversación |
| **AI** | Orquesta llamadas al modelo de lenguaje y gestiona el contexto |
| **WhatsApp Sender** | Envía mensajes salientes vía Evolution API |
| **API** | Capa HTTP para operaciones administrativas |
| **Dashboard** | Interfaz de gestión y monitoreo |

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
