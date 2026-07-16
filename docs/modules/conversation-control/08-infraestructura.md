Siguiente documento:

`docs/modules/conversation-control/08-infraestructura.md`

```md
# COPILOT CONTEXT — Infraestructura
# Módulo Conversation Control

## Objetivo

Definir cómo se implementa la infraestructura del módulo Conversation Control sin contaminar el dominio.

La infraestructura adapta tecnologías externas al modelo interno del sistema.

---

# Principio arquitectónico

La infraestructura conoce:

- Prisma
- Redis
- colas
- almacenamiento
- proveedores externos

El dominio NO conoce nada de esto.

---

# Estructura esperada

```

conversation-control/

├── domain/
│   ├── entities/
│   ├── events/
│   ├── repositories/
│
├── application/
│   └── use-cases/
│
├── infrastructure/
│   ├── persistence/
│   ├── cache/
│   └── messaging/
│
└── interfaces/

```

---

# Persistence

## PrismaConversationRepository

Responsabilidad:

Implementar:

```

ConversationRepository

```

usando Prisma.

---

## Funciones principales

### guardar()

Responsable de:

- crear registro
- convertir entidad a modelo Prisma
- persistir estado actual

---

Ejemplo:

```

ConversationSession

```
    ↓
```

Prisma

```
    ↓
```

Database

````

---

### buscarPorId()

Debe:

- buscar conversación
- validar tenant
- reconstruir entidad

---

Nunca devolver directamente:

```js
prisma.conversation
````

Incorrecto.

---

Correcto:

```js
ConversationSession
```

---

### actualizar()

Responsable de:

* guardar cambios de estado
* actualizar timestamps
* mantener consistencia

---

# Cache

## RedisConversationState

Objetivo:

Mantener estado rápido de conversación.

---

Uso:

Cuando llega un mensaje:

```
Mensaje WhatsApp

       ↓

Consultar estado Redis

       ↓

¿Puede responder Bot?
```

---

Ejemplo:

Estado:

```
HUMAN_ACTIVE
```

Respuesta:

```
No responder
```

---

# Regla importante

Redis NO es la fuente definitiva.

La fuente principal es:

```
PostgreSQL
```

Redis solamente acelera consultas.

---

# Sincronización

Flujo:

```
Cambio de estado

       ↓

Guardar PostgreSQL

       ↓

Actualizar Redis

       ↓

Publicar evento
```

---

# Messaging

## Event Handlers

Responsabilidad:

Escuchar eventos del módulo.

---

Ejemplo:

Evento:

```
HumanInterventionDetected
```

Puede provocar:

* actualizar métricas
* informar dashboard
* registrar aprendizaje

---

No debe:

* cambiar estado directamente
* controlar conversación

---

# Integración Evolution API

## Importante

Evolution NO pertenece al dominio.

Debe vivir en:

```
infrastructure/adapters
```

---

Responsabilidad:

Recibir:

```
fromMe
message
timestamp
instance
```

---

Transformar:

```
Evento externo

        ↓

Evento interno

        ↓

UseCase
```

---

Ejemplo:

Evolution:

```json
{
 "fromMe": true,
 "message": "Hola"
}
```

---

Sistema:

```
HumanMessageReceived
```

---

# Detector de humano

Responsabilidad infraestructura:

Detectar señales externas.

Ejemplo:

```
fromMe=true
```

---

Pero la decisión pertenece al dominio.

Incorrecto:

```js
if(fromMe)
 estado="HUMAN_ACTIVE"
```

---

Correcto:

```
Adapter
 |
 ↓
HumanMessageDetected
 |
 ↓
UseCase
 |
 ↓
Entidad decide
```

---

# Manejo de eventos

Eventos esperados:

```
ConversationCreated

HumanInterventionDetected

HumanModeLocked

BotResumeAvailable

BotResumed
```

---

# Logs

Infraestructura debe registrar:

* conversación
* tenant
* evento
* timestamp

---

Nunca registrar:

* datos sensibles innecesarios
* tokens
* credenciales
* información privada completa

---

# Tests obligatorios

## Prisma Repository

Validar:

* creación
* búsqueda
* actualización
* tenant isolation

---

## Redis Adapter

Validar:

* guardar estado
* recuperar estado
* expiración

---

## Evolution Adapter

Validar:

* recepción evento
* transformación correcta
* errores externos

---

# Restricciones Copilot

Al implementar:

* No meter lógica de negocio aquí.
* No cambiar estados directamente.
* No llamar IA desde infraestructura.
* No depender de módulos concretos.
* Seguir patrón Empresa / Usuario.

```
```
