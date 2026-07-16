# PR 03 - Engines Extraction

## Objetivo

Separar los motores internos del framework en `src/engines` sin cambiar lógica ni comportamiento de V1.

## Motores creados

- `src/engines/agent-runtime`
- `src/engines/conversation-engine/buffer`
- `src/engines/conversation-engine/state-machine`
- `src/engines/ai-engine`

## Archivos movidos

### Agent Runtime

- `src/modules/runtime/**` -> `src/engines/agent-runtime/**`

### Buffer Engine

- `src/modules/buffer/**` -> `src/engines/conversation-engine/buffer/**`

### State Machine Engine

- `src/modules/state-machine/**` -> `src/engines/conversation-engine/state-machine/**`

### AI Engine

- `src/modules/ai/application/**` -> `src/engines/ai-engine/application/**`
- `src/modules/ai/domain/**` -> `src/engines/ai-engine/domain/**`

## Imports cambiados

- `app.js` ahora importa runtime desde `src/engines/agent-runtime/**`.
- `RuntimeEngine.js` ahora importa `execution-policy` desde `src/core/execution-policy/**`.
- Se corrigieron rutas a `src/shared/errors/**` y `src/shared/events/**` en buffer y state-machine por el nuevo nivel de profundidad bajo `src/engines/conversation-engine/**`.

## Wrappers legacy temporales

Se agregaron wrappers en:

- `src/modules/runtime/**`
- `src/modules/buffer/**`
- `src/modules/state-machine/**`
- `src/modules/ai/application/**`
- `src/modules/ai/domain/**`

Esto mantiene compatibilidad temporal con imports legacy del repositorio.

## Tests afectados

- Los tests de runtime, buffer, state-machine y ai-engine se movieron junto con sus archivos fuente.
- No se movió `src/modules/ai/infrastructure/adapters/FakeLLMProvider.js`.

## Riesgos encontrados

- Buffer y state-machine quedaron un nivel más profundos y rompieron imports relativos a `shared/errors` y `shared/events`; se corrigieron en este PR.
- `RuntimeEngine` dependía de la antigua ubicación de `execution-policy`; se apuntó al nuevo árbol `src/core/**`.
- La parte `domain/repositories/LLMProvider.js` quedó promovida con el engine para mantener coherencia del árbol actual; el proveedor fake externo sigue fuera del engine y su compatibilidad se conserva vía wrapper legacy.

## Decisiones tomadas

- No se movió `src/modules/ai/infrastructure/adapters/FakeLLMProvider.js` para respetar la regla de dejar providers externos fuera del engine.
- No se movió `whatsapp-sender` ni `Evolution` en este PR.
- Se preservó el patrón de wrappers legacy usado en PRs anteriores para minimizar riesgo.