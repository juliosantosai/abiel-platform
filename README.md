# Abiel Core

Abiel Core is a long-term framework for multi-tenant conversational orchestration.

## Current Focus

- Framework-first architecture with explicit boundaries
- TypeScript-native runtime and core modules
- Backward compatibility for existing integration flows
- Clear documentation for architecture and module responsibilities

## Architecture

Main layers in src:

- core -> reusable kernel (events, capability, policy, security)
- engines -> orchestration engines (runtime, conversation, ai)
- modules -> business bounded contexts
- infrastructure -> HTTP adapters and wiring
- shared -> shared utilities and transitional compatibility

## Quick Start

```bash
npm install
npx prisma generate
npm start
```

## Useful commands

```bash
npm run typecheck
npm test
npm run arch:check
```

## Documentation

See [docs/README.md](docs/README.md) for the current architecture and module documentation.

## License

MIT