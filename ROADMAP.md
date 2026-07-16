# Abiel Core - Roadmap (Framework Horizon)

## Guiding Rule

No unnecessary folder moves. Prioritize architectural safety, contracts, and long-term maintainability.

---

## Completed

### Migration PRs

- PR1: infrastructure separation + compatibility wrappers
- PR2: core promotion (capability, execution-policy, events, tenant)
- PR3: engines separation (runtime, conversation, ai)
- PR4: modules cleanup and legacy compatibility continuity

### Governance PR

- Core Boundary Hardening + Architecture Fitness Checks
	- layer rules
	- strict architecture checks
	- wrappers inventory
	- wrappers deprecation policy
	- architecture ADR
	- CI validation workflow

---

## Next PR Queue

### PR-A: Wrapper Hygiene Safety Pass (low risk, high return)

- Convert contaminated wrappers to pure re-exports
- Keep all V1 paths
- No behavior changes

### PR-B: Public Contracts Surface

- Define stable public contracts for core and engines
- Reduce deep-path imports and implicit contracts
- Keep internals encapsulated

### PR-C: Plugin Boundary Bootstrapping

- Establish plugin contracts in `src/plugins`
- Keep providers decoupled from core and engines
- Avoid plugin logic leaking into modules/infrastructure

### PR-D: Runtime Observability Baseline

- Add minimal tracing and execution metrics contracts
- Keep transport/storage adapters out of core
- Preserve zero behavior change at API level

---

## Known Technical Debt (Tracked, Not Auto-Fixed)

- wrappers: 58
- contaminated wrappers: 17
- implicit contracts: 57
- pre-existing env test drift (PORT expectation)
- pre-existing Jest open handles warning

---

## Success Criteria for the Next 12 Months

- zero new boundary violations in CI
- progressive wrapper reduction with V1 compatibility maintained
- public contracts versioned and documented
- plugin boundaries active and testable
- architectural drift detectable within a single PR cycle