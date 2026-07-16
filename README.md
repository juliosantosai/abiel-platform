# Abiel Core

Abiel Core is a long-term framework for multi-tenant conversational orchestration.

## Current Focus

- Framework-first architecture (not app-first)
- Stable boundaries between layers
- Backward compatibility for V1 imports
- Automated architecture governance in CI

## Architecture

Main layers in `src`:

- `core` -> reusable kernel (events, capability, policy, security)
- `engines` -> orchestration engines (runtime, conversation, ai)
- `modules` -> business bounded contexts
- `plugins` -> extension points (currently empty, reserved)
- `infrastructure` -> http/adapters/wiring
- `shared` -> transitional shared utilities and compatibility wrappers

## Architecture Fitness Checks

This repository includes automated architecture checks:

```bash
npm run arch:inventory:wrappers
npm run arch:check
npm run arch:check:strict
```

What is enforced:

- layer dependency rules
- circular dependency detection
- clean architecture violations (domain/application -> infrastructure)
- wrappers inventory and contamination detection

Reference docs:

- [docs/arquitectura/fitness-checks.md](docs/arquitectura/fitness-checks.md)
- [docs/adr/0001-core-boundary-hardening.md](docs/adr/0001-core-boundary-hardening.md)
- [docs/arquitectura/politica-deprecacion-wrappers.md](docs/arquitectura/politica-deprecacion-wrappers.md)

## Quick Start

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm test -- --runInBand
```

## Documentation Index

See [docs/README.md](docs/README.md) for updated architectural and module documentation.

## License

MIT