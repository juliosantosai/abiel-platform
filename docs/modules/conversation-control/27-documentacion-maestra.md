# Documentación maestra — Conversation Control

## 1. Propósito del módulo

Conversation Control es el módulo responsable de administrar el control operativo de una conversación entre un asistente de IA y una intervención humana. Su objetivo no es generar respuestas, sino decidir si la conversación puede avanzar automáticamente o debe permanecer en modo supervisado.

## 2. Responsabilidad principal

Este módulo garantiza que:

- la IA solo responda cuando tenga permiso para hacerlo,
- la intervención humana tenga prioridad sobre la automatización,
- los cambios de estado sean trazables y seguros,
- la conversación mantenga coherencia operativa y de auditoría.

## 3. Alcance

Incluye:

- gestión del estado de conversación,
- detección de intervención humana,
- reanudación del control automático,
- bloqueo permanente o temporal del bot,
- emisión de eventos de dominio relacionados con cambios de estado.

## 4. Fuera de alcance

No corresponde a este módulo:

- generar contenido IA,
- autenticar usuarios,
- administrar permisos complejos,
- resolver directamente integraciones externas con WhatsApp o Evolution API en la lógica de negocio.

## 5. Principios arquitectónicos

- El dominio debe ser independiente de infraestructura.
- La lógica de negocio no debe depender de Prisma, Evolution API ni de la capa de interfaz.
- La intervención humana tiene prioridad sobre la automatización.
- Cada conversación debe estar asociada a un tenant y a un cliente o contacto.
- Los cambios de estado deben publicarse como eventos de dominio.

## 6. Modelo de dominio

### Entidad principal

ConversationSession

Atributos esperables:

- id
- empresaId
- clienteId
- estado
- ultimaIntervencionHumana
- creadoEn
- actualizadoEn

### Estados posibles

- BOT_ACTIVE
- HUMAN_ACTIVE
- BOT_RESUME_PENDING
- HUMAN_LOCKED
- CLOSED

## 7. Reglas de negocio centrales

1. La intervención humana tiene prioridad sobre la IA.
2. Cuando un humano participa, el bot debe dejar de responder.
3. Si el humano deja de intervenir durante un tiempo definido, la conversación puede pasar a un estado de reanudación.
4. Un bloqueo permanente impide que la IA retome el control hasta una acción manual.
5. Una conversación cerrada no puede volver a reabrirse automáticamente.

## 8. Máquina de estados

### Estado BOT_ACTIVE

El bot tiene control de la conversación y puede responder automáticamente.

### Estado HUMAN_ACTIVE

Un humano está atendiendo la conversación. El bot debe permanecer en silencio.

### Estado BOT_RESUME_PENDING

El humano ya no interviene y el sistema espera reanudar el control automático con una validación adicional.

### Estado HUMAN_LOCKED

La conversación quedó bloqueada para la IA de forma permanente o de alto riesgo.

### Estado CLOSED

La conversación finalizó. No se permiten nuevas respuestas automáticas.

## 9. Casos de uso principales

- Crear sesión de conversación.
- Detectar intervención humana.
- Evaluar reanudación del bot.
- Reanudar control al bot.
- Bloquear una conversación.
- Cerrar una conversación.

## 10. Arquitectura hexagonal

### Dominio

- entidad de conversación
- value objects
- reglas de transición
- eventos de dominio

### Application

- casos de uso
- coordinación entre dominio y repositorio
- publicación de eventos

### Infrastructure

- repositorios
- adaptadores externos
- workers y listeners

### Interfaces

- APIs
- jobs
- webhooks
- servicios externos

## 11. Integración externa

La integración con Evolution API o con cualquier canal debe estar desacoplada del dominio. Las capas externas solo deben traducir eventos externos a comandos del módulo.

## 12. Recomendación de implementación

El módulo debería implementarse en capas con una entidad de dominio fuerte, casos de uso claros y repositorios abstractos. La prioridad inicial debería ser:

1. modelo de dominio,
2. máquina de estados,
3. casos de uso,
4. repositorios,
5. adaptadores externos.
