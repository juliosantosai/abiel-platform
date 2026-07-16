# Conversation Control — Documentación del módulo

## Propósito

Este módulo encapsula la lógica de control de conversación entre el asistente de IA y la intervención humana. Su responsabilidad es garantizar que la conversación solo responda cuando el flujo de negocio lo permita.

## Documentos principales

- [00-descripcion.md](00-descripcion.md): visión general, alcance, límites y arquitectura.
- [01-reglas-negocio.md](01-reglas-negocio.md): reglas de negocio y políticas de control.
- [02-maquina-estados.md](02-maquina-estados.md): definición formal de la máquina de estados.
- [03-entidades-y-value-objects.md](03-entidades-y-value-objects.md): modelo de dominio y objetos de valor.
- [06-casos-de-uso.md](06-casos-de-uso.md): casos de uso principales del módulo.
- [18-arquitectura-hexagonal.md](18-arquitectura-hexagonal.md): diseño hexagonal y puntos de integración.

## Principios arquitectónicos

- El dominio debe permanecer independiente de Evolution API, Prisma y de la UI.
- El estado de la conversación se modifica únicamente mediante casos de uso o métodos del dominio.
- La intervención humana tiene prioridad sobre la respuesta automática.
- Cada conversación debe estar asociada a un tenant y a un cliente.
