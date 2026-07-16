# Abiel Core

Event-driven framework for building intelligent multi-tenant conversational systems.

## Status: 266/270 Tests Passing ✅

**Database:** PostgreSQL with Prisma ORM  
**Testing:** Jest with --runInBand for serial execution  
**Architecture:** Domain-Driven Design + Hexagonal + Event-Driven  

## Features

- ✅ Event Bus (refactored, exportable class)
- ✅ Message Buffer
- ✅ State Machine (ConversationSession states)
- ✅ Multi-Tenant (TenantContext + TenantGuard)
- ✅ AI Agnostic (LLMProvider contract)
- ✅ PostgreSQL (Prisma migrations applied)
- ✅ Prisma Repositories (idempotent upsert pattern)
- ✅ E2E Tests (13/17 database, 4 API skeleton)
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
npm test -- --runInBand

# Run specific module tests
npm test -- src/modules/empresa --runInBand
```

## Documentation

See [docs/README.md](docs/README.md) for complete architecture documentation.

## License

MIT