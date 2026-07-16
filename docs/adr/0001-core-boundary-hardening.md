# ADR 0001 - Core Boundary Hardening and Architecture Fitness Checks

## Status
Accepted

## Context
After PR1-PR4, Abiel Core already split core, engines, modules and part of infrastructure.
The remaining risk is architectural regression by uncontrolled dependencies and legacy wrappers that can accidentally become permanent.

We need guardrails that preserve V1 compatibility and do not alter functional behavior.

## Decision
1. Define explicit allowed dependencies between layers in tools/architecture/layer-rules.json.
2. Add automated fitness checks in tools/architecture/check-architecture.js.
3. Track legacy wrappers with an inventory file and contamination detection.
4. Introduce deprecation policy for wrappers with staged removal gates.
5. Enforce checks in CI with strict mode for hard violations only.

## Layer Dependency Policy
- core -> core
- engines -> core, engines, shared
- modules -> core, engines, modules, shared
- plugins -> core, engines, plugins, shared
- infrastructure -> core, engines, modules, plugins, infrastructure, shared
- shared -> core, shared

## Consequences
### Positive
- Regressions in layer boundaries are detected early.
- Circular dependencies are blocked in CI.
- Wrappers remain compatible but become visible debt with owner and retirement plan.

### Negative
- Initial warning volume for implicit contracts and wrapper contamination.
- Team discipline required to maintain exception-free checks.

## Compatibility
- No runtime behavior changes.
- No folder moves.
- No wrapper removals.
- V1 import paths remain valid.

## Rollback Plan
1. Revert CI workflow file for architecture checks.
2. Revert package.json scripts added for architecture.
3. Keep documentation as historical record.

Functional code remains untouched, so rollback risk is low.

## Review Date
2026-10-16
