# COPILOT CONTEXT — Infraestructura y Adapters
# Módulo Conversation Control

## Objetivo

Definir cómo la capa de infraestructura conecta Conversation Control con sistemas externos.

Esta capa implementa los contratos definidos por dominio y application.

---

# Principio arquitectónico

La infraestructura conoce:

- Prisma
- Evolution API
- WhatsApp
- Redis
- colas
- servicios externos

El dominio NO conoce nada de esto.

---

# Estructura esperada

```text
conversation-control

├── domain

├── application

├── infrastructure

│   ├── persistence

│   ├── messaging

│   ├── channels

│   └── cache

└── interfaces