# Arquitectura hexagonal — Conversation Control

## Objetivo

Definir la arquitectura del módulo Conversation Control para que la lógica de negocio sea independiente de infraestructura, integraciones externas y delivery.

## Capas propuestas

### 1. Dominio

Contiene:
- la entidad ConversationSession
- value objects como ConversationState
- reglas de transición
- eventos de dominio

### 2. Application

Contiene:
- casos de uso para detectar intervención humana
- casos de uso para reanudar o bloquear el bot
- coordinación entre repositorio, dominio y eventos

### 3. Infrastructure

Contiene:
- persistencia
- adaptadores para Evolution API
- workers y event handlers

### 4. Interfaces

Contiene:
- controladores o entry points
- APIs, jobs o listeners

## Principios

- El dominio no conoce Evolution API.
- El dominio no conoce Prisma.
- Los casos de uso no mezclan lógica de infraestructura con reglas de negocio.
- Los eventos de dominio permiten desacoplar auditoría, notificaciones y trazabilidad.

## Flujo recomendado

1. Llegan mensajes o eventos externos.
2. La aplicación interpreta el evento y decide si corresponde a intervención humana.
3. Se ejecuta la lógica del dominio.
4. Se persiste el cambio.
5. Se publica un evento de dominio.
