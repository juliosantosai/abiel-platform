Siguiente documento:

`docs/modules/conversation-control/01-reglas-de-negocio.md`

```md
# Reglas de Negocio — Conversation Control

## 1. Objetivo

Este documento define las reglas de negocio que gobiernan el comportamiento del control conversacional entre inteligencia artificial y operadores humanos dentro de Abiel Core.

Las reglas aquí definidas tienen prioridad sobre cualquier comportamiento automático del agente IA.

---

# 2. Principio principal

## El humano siempre tiene prioridad

Cuando un operador humano interviene en una conversación:

- La IA debe detener sus respuestas.
- La conversación pasa a modo humano.
- La IA continúa observando y aprendiendo.
- La IA no debe enviar mensajes hasta tener autorización.

Regla:

```

Humano > Inteligencia Artificial

````

---

# 3. Propiedad de control de una conversación

Toda conversación tiene un propietario temporal:

Estados posibles:

- Control IA
- Control humano temporal
- Control humano permanente

El sistema debe conocer en todo momento quién tiene permiso para responder.

---

# 4. Detección de intervención humana

## 4.1 Mensaje enviado desde dispositivo humano

Cuando Evolution API envía:

```json
{
  "fromMe": true
}
````

El sistema interpreta:

"Un mensaje salió desde el número conectado".

Esto genera una evaluación:

* ¿Fue enviado por un humano?
* ¿Fue enviado por el propio bot?
* ¿Existe una sesión activa?

---

# 5. Diferencia entre IA y humano

No todo mensaje `fromMe=true` significa humano.

El sistema debe diferenciar:

## Mensaje generado por IA

Ejemplo:

```
Bot responde automáticamente
```

Debe mantener:

```
BOT_ACTIVE
```

---

## Mensaje enviado manualmente

Ejemplo:

```
Vendedor escribe desde WhatsApp
```

Debe activar:

```
HUMAN_ACTIVE
```

---

# 6. Estado HUMAN_ACTIVE

Cuando un humano toma la conversación:

El sistema debe:

Permitir:

* lectura de mensajes
* análisis de contexto
* aprendizaje
* almacenamiento de información

Bloquear:

* respuestas automáticas
* mensajes comerciales IA
* seguimiento automático

---

# 7. Tiempo de espera para devolución del control

Cuando el humano deja de escribir:

El sistema inicia un temporizador.

Valor inicial:

```
5 minutos
```

Si durante ese período no existen nuevos mensajes humanos:

La conversación puede volver al control IA.

---

# 8. Reanudación automática

Condiciones:

Debe cumplirse:

* Estado actual = HUMAN_ACTIVE
* Tiempo sin intervención >= 5 minutos
* No existe bloqueo permanente

Resultado:

```
HUMAN_ACTIVE

        ↓

BOT_ACTIVE
```

---

# 9. Bloqueo permanente

Existe un modo especial:

```
HUMAN_LOCKED
```

Significa:

"La IA no debe participar nuevamente".

---

## Casos donde aplica:

* Cliente importante
* Reclamo
* Negociación humana
* Atención personalizada
* Decisión del administrador

---

# 10. Regla de bloqueo permanente

Cuando una conversación está:

```
HUMAN_LOCKED
```

La IA:

NO puede:

* responder
* enviar mensajes
* iniciar seguimientos
* ejecutar automatizaciones

La IA solamente puede:

* registrar información
* analizar conversación
* aprender contexto

---

# 11. Activación manual del modo humano

El sistema debe permitir una acción explícita:

Ejemplo:

Administrador:

"Tomar conversación"

Resultado:

```
BOT_ACTIVE

       ↓

HUMAN_LOCKED
```

---

# 12. Nunca perder contexto

Cuando cambia el control:

La conversación mantiene:

* historial completo
* mensajes anteriores
* intención del cliente
* datos aprendidos
* estado comercial

Cambiar el responsable de responder no elimina información.

---

# 13. Regla multi-tenant

Toda conversación pertenece a una empresa.

Ejemplo:

```
Empresa A

Conversación Cliente X
```

No puede ser utilizada por:

```
Empresa B
```

Todas las operaciones deben validar:

* tenantId
* empresaId
* permisos del usuario

---

# 14. Eventos obligatorios

Toda transición importante debe generar evento:

Ejemplo:

```
HumanInterventionDetected

HumanModeActivated

HumanModeReleased

HumanModeLocked

BotResumed
```

Estos eventos permitirán:

* auditoría
* métricas
* aprendizaje
* análisis comercial

---

# 15. Regla final del módulo

La automatización debe ayudar al humano, nunca competir con él.

El sistema debe comportarse como:

```
IA asistente

NO

IA reemplazo sin control
```

```

---

## Estimación del trabajo

Documento de reglas de negocio:

- Análisis de escenarios: 2 h
- Definición reglas SaaS: 1 h
- Documentación formal: 1 h

**Total: 4 horas hombre**

Costo estimado:

- Semi Senior: **USD 120**
- Senior: **USD 320**

Acumulado Abiel Core:

Anterior: **190 - 251 h**

Nuevo documento: **+4 h**

Total acumulado:

**194 - 255 horas hombre**.
```
