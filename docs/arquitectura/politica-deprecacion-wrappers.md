# Politica de Deprecacion de Wrappers Legacy

## Objetivo
Mantener compatibilidad V1 mientras se retiran wrappers en forma controlada, sin regresiones funcionales.

## Alcance
Aplica a wrappers de reexport en:
- src/modules/* que apuntan a src/engines o src/infrastructure
- src/shared/* que apuntan a src/core

## Reglas
1. No eliminar wrappers en PRs de hardening.
2. Todo wrapper debe ser reexport puro (sin codigo residual en la misma linea).
3. Todo wrapper debe figurar en docs/arquitectura/wrappers-legacy-inventory.md.
4. Todo wrapper debe tener owner de retiro y fecha objetivo en el backlog.

## Fases
1. Fase 0 - Inventario
   - Identificar wrappers y wrappers contaminados.
2. Fase 1 - Higiene
   - Limpiar wrappers contaminados sin cambiar exportaciones.
3. Fase 2 - Adopcion
   - Migrar imports consumidores a rutas target estables.
4. Fase 3 - Retiro
   - Eliminar wrapper solo cuando uso sea cero y exista ventana de versionado.

## Criterios de Retiro
- Cero referencias en busqueda de codigo.
- Public API estable documentada para el caso.
- Changelog y nota de version publicados.

## Riesgos y Mitigacion
- Riesgo: ruptura de integraciones legacy.
- Mitigacion: monitoreo de uso, rollout gradual, feature branch de rollback.
