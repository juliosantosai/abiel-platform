# Módulo Empresa

## Objetivo

El módulo Empresa es responsable de identificar, validar y administrar cada empresa que utiliza Abiel Core.

Es el primer filtro de negocio del sistema. Ningún mensaje continúa su procesamiento si la empresa no existe, está suspendida o no tiene una suscripción activa.

---

# Responsabilidades

- Registrar empresas.
- Identificar la empresa a partir de la instancia de Evolution API.
- Validar el estado de la empresa.
- Verificar la suscripción.
- Proveer la configuración de la empresa al resto del sistema.

---

# Entradas

Evento recibido:

```text
message.received
```

Ejemplo:

```json
{
  "instance": "empresa-demo",
  "remoteJid": "595981234567@s.whatsapp.net",
  "message": {
    "conversation": "Hola"
  }
}
```

---

# Flujo

```text
Webhook
    │
    ▼
EventBus
    │
    ▼
Empresa
```

El módulo realiza las siguientes validaciones:

1. ¿Existe una empresa asociada a esta instancia?
2. ¿Está activa?
3. ¿Tiene una suscripción vigente?
4. ¿No está suspendida?

Si todas son correctas, publica un nuevo evento.

---

# Eventos publicados

## Empresa validada

```text
company.validated
```

Ejemplo:

```json
{
  "companyId": "cmp_001",
  "instance": "empresa-demo",
  "plan": "pro",
  "remoteJid": "595981234567@s.whatsapp.net",
  "message": {
    "conversation": "Hola"
  }
}
```

---

## Empresa rechazada

```text
company.rejected
```

Ejemplo:

```json
{
  "instance": "empresa-demo",
  "reason": "subscription_expired"
}
```

---

# Estados posibles

| Estado | Descripción |
|---------|-------------|
| ACTIVE | Empresa operativa. |
| SUSPENDED | Suspendida manualmente. |
| EXPIRED | Suscripción vencida. |
| BLOCKED | Bloqueada por el sistema. |

---

# Información administrada

Cada empresa posee:

- id
- nombre
- instancia Evolution
- estado
- plan
- fecha de vencimiento
- configuración
- credenciales
- fecha de creación

---

# Relaciones

Este módulo es utilizado por:

- Buffer
- State Machine
- AI
- Sender
- API

Todos los módulos reciben el contexto de la empresa ya validado.

---

# Objetivos de diseño

- Independencia del proveedor de WhatsApp.
- Escalable para miles de empresas.
- Bajo acoplamiento mediante Event Bus.
- Compatible con múltiples instancias de Evolution API.

---

# Futuras mejoras

- Límite de conversaciones por plan.
- Límite de usuarios.
- Facturación.
- Auditoría.
- Caché en Redis.
- Balanceo entre múltiples instancias.