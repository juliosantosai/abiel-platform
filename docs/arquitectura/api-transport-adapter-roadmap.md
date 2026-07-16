# API as Transport Adapter - Roadmap and Current Implementation

## Objective
Evolve HTTP API into a transport adapter fully decoupled from domain behavior.

## Scope implemented in this phase
This phase focused on the highest-priority foundations without functional changes:

1. API Contracts (base)
2. Error Pipeline (base)
3. DTO + Mapper boundary (base)
4. Validation pipeline extraction (base)
5. Middleware pipeline baseline (base)
6. Versioning bootstrap (`/api` + `/api/v1` + `/api/internal`)

## New structure introduced

- `src/infrastructure/api/contracts`
- `src/infrastructure/api/errors`
- `src/infrastructure/api/validators`
- `src/infrastructure/api/mappers`
- `src/infrastructure/api/middleware/pipeline.js`
- `src/infrastructure/api/versioning/ApiVersioning.js`
- `src/infrastructure/api/observability/requestContext.js`
- `src/infrastructure/api/health/healthController.js`

## What changed

### API Contracts
Added common contracts for response envelope and error details:

- `ApiRequest`
- `ApiResponse`
- `ApiError`
- `ProblemDetails`
- `Pagination`
- `Cursor`
- `Metadata`

Controllers now return contract-driven responses instead of ad-hoc shapes.

### Error Pipeline
Added centralized mapping:

- Domain/application/infrastructure errors -> HTTP map
- Unified `ProblemDetails`
- Unified error envelope

Controllers no longer need to serialize errors directly.

### DTO and Mappers
Added mapper boundary for:

- empresa
- usuario
- conversation-control
- dashboard

Controllers now return DTOs through mappers instead of raw internal objects.

### Validation Pipeline
Validation moved from inline controller checks into dedicated validators per resource.

### Middleware Pipeline
Introduced centralized pipeline registration with request/correlation IDs and shared rate limiting registration.

### Versioning
Added bootstrap-level support:

- `/api` (compatibility)
- `/api/v1` (formalized)
- `/api/internal` (health)

## Compatibility

- No folder moves.
- No wrapper removals.
- No domain behavior changes.
- Existing `/api/*` routes preserved.

## Validation

- API tests: all passing (`src/infrastructure/api`, 53/53)
- Full suite: one pre-existing failure outside API scope (`src/shared/config/env.test.js`)

## Remaining roadmap steps

### Next PR recommendations

1. Formal DTO package and strict typed contracts per endpoint.
2. Move auth/authorization/tenant/validation to full pipeline order as policy.
3. Add OpenAPI generation from contracts.
4. Add metrics and tracing adapters (transport-level observability).
5. Add adapter parity plan for non-HTTP transports.

## Risks and constraints

- Current mappers are conservative and preserve existing payload shapes for compatibility.
- Existing dashboard HTML expects legacy `success/data/error`; this remains compatible in this phase.
- Full transport-agnostic maturity still requires contract-first use case ports and generated schemas.
