Siguiente documento:

`docs/modules/conversation-control/20-repositorios-y-persistencia.md`

````md
# COPILOT CONTEXT — Repositorios y Persistencia
# Módulo Conversation Control

## Objetivo

Definir cómo se almacenará el estado de las conversaciones y cómo la máquina de estados accederá a los datos.

La persistencia debe mantener la separación entre dominio e infraestructura.

---

# Principio arquitectónico

El dominio NO conoce:

- Prisma
- PostgreSQL
- Redis
- Evolution API
- WhatsApp

---

El dominio conoce solamente:

```text
ConversationRepository
````

---

Flujo:

```text
Use Case

↓

Repository Interface

↓

Infrastructure

↓

Database
```

---

# Entidad Conversation

Representa una conversación entre:

* cliente
* empresa
* canal
* bot/humano

---

Datos principales:

```json
{
 id,
 empresaId,
 customerId,
 channel,
 state,
 lastHumanActivity,
 lastBotActivity,
 lockedReason
}
```

---

# Estados persistidos

Valores permitidos:

```text
BOT_ACTIVE

HUMAN_ACTIVE

BOT_RESUME_PENDING

HUMAN_LOCKED
```

---

# ConversationRepository

Contrato del dominio:

```js
class ConversationRepository {

 buscarPorId(id)

 guardar(conversation)

 actualizar(conversation)

 buscarPorCliente(clienteId)

 buscarActivas()

}
```

---

# Métodos obligatorios

## buscarPorId

Objetivo:

Obtener una conversación específica.

---

Entrada:

```text
conversationId
```

---

Salida:

```text
Conversation
```

---

# guardar

Objetivo:

Crear o actualizar estado.

---

Ejemplo:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE
```

---

Debe guardar:

* nuevo estado
* fecha cambio
* motivo
* usuario responsable

---

# actualizarEstado

Método especializado.

---

Entrada:

```json
{
 conversationId,
 newState
}
```

---

Validación:

La máquina de estados decide si es válido.

---

# buscarConversacionesHumanas

Objetivo:

Encontrar conversaciones esperando timeout.

---

Uso:

Worker automático.

---

Ejemplo:

Buscar:

```text
HUMAN_ACTIVE
```

con:

```text
lastHumanActivity > 5 minutos
```

---

Resultado:

Lista para evaluar.

---

# PrismaConversationRepository

Implementación real.

Ubicación:

```text
infrastructure/persistence
```

---

Responsabilidades:

* mapear Prisma
* guardar datos
* consultar estados

---

No debe:

* decidir transiciones
* detectar humanos
* activar bot

---

# Modelo Prisma esperado

Ejemplo:

```prisma
model Conversation {

 id String @id

 empresaId String

 customerId String

 channel String

 state String

 lastHumanActivity DateTime?

 lastBotActivity DateTime?

 lockedReason String?

 createdAt DateTime @default(now())

 updatedAt DateTime @updatedAt

}
```

---

# FakeConversationRepository

Uso:

* tests
* desarrollo
* dominio

---

Debe permitir:

```js
guardar()

buscarPorId()

actualizar()
```

---

Ejemplo:

```js
const repository =
new FakeConversationRepository()
```

---

# Índices importantes

Para producción:

```text
empresaId

state

customerId
```

---

Motivo:

El sistema será multi-tenant.

---

# Aislamiento Tenant

Toda consulta debe incluir:

```text
empresaId
```

---

Incorrecto:

```sql
SELECT *
FROM conversation
WHERE id = ?
```

---

Correcto:

```sql
SELECT *
FROM conversation
WHERE id = ?
AND empresaId = ?
```

---

# Auditoría

Cada cambio de estado debe registrar:

```json
{
 conversationId,
 previousState,
 newState,
 changedBy,
 reason,
 timestamp
}
```

---

Ejemplo:

```text
BOT_ACTIVE

↓

HUMAN_ACTIVE

Motivo:
"Operador respondió WhatsApp"
```

---

# Integración con eventos

El repositorio NO publica eventos.

Responsabilidad:

```text
Use Case
```

---

Ejemplo:

```text
Guardar conversación

↓

Publicar HumanModeActivated
```

---

# Cache opcional

Redis puede utilizarse para:

* estado actual
* bloqueo rápido
* sesiones activas

---

Pero:

Fuente de verdad:

```text
PostgreSQL
```

---

# Tests obligatorios

## FakeRepository

Validar:

* guardar conversación
* buscar por id
* actualizar estado

---

## PrismaRepository

Validar:

* mapping correcto
* filtros por empresaId
* persistencia de estados

---

## Seguridad tenant

Debe fallar:

```text
empresa A

buscando conversación empresa B
```

---

# Restricciones Copilot

* Repository no contiene reglas de negocio.
* Repository no decide estados.
* Todas las consultas respetan empresaId.
* Mantener arquitectura hexagonal.
* No acoplar a Evolution API.

```
```
