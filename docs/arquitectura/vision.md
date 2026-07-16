# Visión y arquitectura

## Qué es Abiel Core

SaaS multi-tenant para automatización de atención al cliente mediante IA con supervisión humana. Cada cliente del sistema es una **Empresa** (tenant). Cada empresa tiene usuarios, conversaciones y configuraciones independientes.

## Estilo arquitectónico

**Monolito modular.** Una sola aplicación, una sola base de datos, módulos internamente desacoplados. Preparado para escalar hacia microservicios sin reestructuración mayor.

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js + CommonJS |
| Base de datos | PostgreSQL |
| ORM | Prisma 7 con adaptador pg |
| Tests | Jest |
| Control de versiones | Git |

## Principios

- **DDD** — el código refleja el lenguaje del negocio.
- **Arquitectura Hexagonal** — el dominio no depende de infraestructura.
- **Clean Architecture** — dependencias apuntan hacia adentro.
- **SOLID** — responsabilidad única, abierto/cerrado, inversión de dependencias.
- **Event-Driven** — los módulos se comunican mediante eventos de dominio.

## Capas de cada módulo

```
domain/         ← reglas de negocio, entidades, value objects, eventos
application/    ← casos de uso, workers (orquestación)
infrastructure/ ← repositorios Prisma, adapters externos
interfaces/     ← HTTP, webhooks, consumers
```

**Regla fundamental:** ninguna capa importa de una capa exterior. El dominio no conoce Prisma, los casos de uso no conocen HTTP.

## Tenant isolation

Todo recurso pertenece a una empresa. `TenantGuard` (shared/tenant) valida en los use cases que un operador no pueda leer ni modificar recursos de otro tenant.
