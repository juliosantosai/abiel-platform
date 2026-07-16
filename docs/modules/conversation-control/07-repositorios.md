# COPILOT CONTEXT — Repositorios
# Módulo Conversation Control

## Objetivo

Definir los contratos de persistencia para la gestión de conversaciones y estados de intervención humana.

Los repositorios pertenecen al dominio como contratos.

La implementación concreta pertenece a infraestructura.

---

# Principio arquitectónico

El dominio NO conoce:

- Prisma
- PostgreSQL
- Redis
- Evolution API
- WhatsApp

El dominio solo conoce interfaces.

---

# ConversationRepository

## Responsabilidad

Persistir y recuperar sesiones de conversación.

---

## Contrato esperado

```js
class ConversationRepository {

    guardar(conversation) {
        throw new Error()
    }


    buscarPorId(id) {
        throw new Error()
    }


    actualizar(conversation) {
        throw new Error()
    }


    buscarPorCliente(clienteId) {
        throw new Error()
    }


    buscarPorEmpresa(empresaId) {
        throw new Error()
    }

}