# Arquitectura

```mermaid
flowchart LR

Webhook --> EventBus

EventBus --> Empresa

Empresa --> Buffer

Buffer --> STM

STM --> AI

AI --> Sender

Sender --> Evolution
```