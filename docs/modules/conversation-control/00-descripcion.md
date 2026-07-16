# Descripción del módulo Conversation Control

## Propósito

El módulo Conversation Control es responsable de decidir cuándo una conversación puede responder automáticamente mediante IA y cuándo debe pasar a un modo controlado por intervención humana.

## Responsabilidad principal

Este módulo no resuelve la conversación en sí, sino que administra el control de la conversación. Su función es garantizar que:

- la IA solo responda cuando está autorizada,
- la intervención humana tenga prioridad,
- los cambios de estado sean predecibles y trazables,
- la conversación mantenga integridad operativa y de auditoría.

## Alcance

Incluye:

- gestión del estado de una conversación,
- detección de intervención humana,
- reanudación del control por parte del bot,
- bloqueo manual o temporal de la IA,
- eventos de dominio asociados al cambio de estado.

## Fuera de alcance

No corresponde a este módulo:

- generar contenido de IA,
- realizar autenticación,
- administrar permisos de usuario,
- integrar directamente con WhatsApp o Evolution API en la lógica de negocio.

## Arquitectura propuesta

El módulo debe seguir una arquitectura hexagonal:

- Dominio: entidad de conversación, reglas de transición, value objects y eventos.
- Application: casos de uso para detectar intervención, reanudar bot, bloquear conversación.
- Infrastructure: repositorios, adaptadores de integración y workers.
- Interfaces: APIs, listeners o procesos externos.

## Atributos clave

Cada conversación debe tener:

- identificador único,
- tenant asociado,
- referencia al cliente o contacto,
- estado actual,
- última actividad humana,
- timestamp de última actualización.
