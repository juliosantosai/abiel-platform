# API Architecture

ABIEL CORE expone cuatro superficies HTTP separadas para sostener la migracion incremental desde una API mixta hacia una plataforma SaaS con responsabilidades explicitas.

## Surfaces

### Web Admin interno

- Base path: `/api/admin`
- Consumidor principal: panel interno de ABIEL
- Objetivo: observabilidad, arquitectura, runtime, logs, metricas y operacion interna

Rutas activas principales:

- `GET /api/admin/dashboard`
- `GET /api/admin/architecture`
- `GET /api/admin/components/:type/:id`
- `GET /api/admin/runtime`
- `GET /api/admin/health`
- `GET /api/admin/metrics`
- `GET /api/admin/logs`
- `GET /api/admin/modules`
- `GET /api/admin/plugins`
- `GET /api/admin/tenants`

### Customer Portal

- Base path: `/api/customer` y alias versionado `/api/v1/customer`
- Consumidor principal: portal SaaS de clientes
- Objetivo: exponer identidad del tenant, uso y recursos funcionales sin acoplar el frontend al runtime interno

Rutas base:

- `GET /api/customer/profile`
- `GET /api/customer/usage`
- `GET /api/customer/agents`
- `GET /api/customer/conversations`
- `GET /api/customer/knowledge`

### Core Runtime API

- Base path: `/api/core` y alias versionado `/api/v1/core`
- Consumidor principal: herramientas internas, control plane y automatizacion operativa
- Objetivo: exponer estado del runtime, modulos, plugins y eventos sin mezclar endpoints de customer o admin funcional

Rutas base:

- `GET /api/core/runtime/status`
- `GET /api/core/modules`
- `GET /api/core/plugins`
- `GET /api/core/events`
- `GET /api/core/health`

### Public API

- Base path: `/api/public` y alias versionado `/api/v1/public`
- Consumidor principal: sitio publico, onboarding y growth
- Objetivo: exponer signup, catalogo de planes y solicitud de demo con contratos controlados

Rutas base:

- `POST /api/public/signup`
- `GET /api/public/plans`
- `POST /api/public/demo`

## Flow separation

- Web Admin -> `/api/admin`
- Customer Portal -> `/api/customer`
- Runtime and control plane -> `/api/core`
- Public site and acquisition flows -> `/api/public`

## Composition model

`RuntimeBootstrap` sigue siendo la raiz del sistema.

`ExpressApp` ahora se limita a:

- crear el servidor Express
- registrar middleware global
- delegar el montaje HTTP a `src/bootstrap/http/registerRuntimeHttpRoutes.ts`

La composicion de routers y superficies HTTP se centraliza en bootstrap para mantener el runtime como unica fuente de ensamblado.

## Incremental migration notes

- La superficie admin existente sigue siendo compatible para `abiel-front`.
- La separacion nueva reutiliza contratos y middleware existentes donde todavia no hay una capa unificada.
- Persisten duplicaciones entre `src/api` y `src/infrastructure/api`; la siguiente fase debe consolidar controllers, services y contratos en una sola arquitectura HTTP.