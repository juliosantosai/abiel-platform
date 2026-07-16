# Abiel Core

Event-driven framework for building intelligent multi-tenant conversational systems.

## Status: 330/334 Tests Passing ✅

**Database:** PostgreSQL with Prisma ORM  
**Testing:** Jest  
**Architecture:** Domain-Driven Design + Hexagonal + Event-Driven  

## Features

- ✅ Event Bus (refactored, exportable class)
- ✅ Core Runtime V1 (RuntimeEngine + ExecutionContext + ExecutionLifecycle + EventDispatcher)
- ✅ Execution Policy V1 (RetryPolicy + TimeoutPolicy + ErrorClassifier + PermissionChecker)
- ✅ Runtime cancellation flow (ExecutionCancelled + ResultEvent(cancelled))
- ✅ Message Buffer
- ✅ State Machine (ConversationSession states)
- ✅ Multi-Tenant (TenantContext + TenantGuard)
- ✅ AI Agnostic (LLMProvider contract)
- ✅ PostgreSQL (Prisma migrations applied)
- ✅ Prisma Repositories (idempotent upsert pattern)
- ✅ Runtime unit, contract and integration tests (including cancellation)
- ⚠️ JWT Authentication (hardcoded secret, needs env var)
- ⚠️ Input Validation (security gap)
- ❌ Dashboard (not started)

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply migrations to PostgreSQL
npx prisma migrate deploy

# Run all tests
npm test

# Run specific module tests
npm test -- src/modules/empresa --runInBand
```

## Documentation

See [docs/README.md](docs/README.md) for architecture and module documentation.
Core runtime implementation spec: [ARCHITECTURE_CORE_SPEC_V2.md](ARCHITECTURE_CORE_SPEC_V2.md).

## License

MIT