# PR17 — Stabilization & Production Readiness

## Objetivo

Convertir Abiel Core de una arquitectura limpia en un producto SaaS ejecutable y operable, sin introducir cambios de comportamiento ni reescribir la lógica de negocio.

## No objetivo

- no introducir nuevos wrappers ni shims
- no mover lógica de negocio entre capas sin una justificación clara
- no iniciar una nueva migración estructural

## Fase 1 — Auditoría final de módulos restantes

### Objetivo

Identificar deuda residual en módulos que todavía puedan contener:

- archivos JS antiguos
- mocks y fakes mezclados con implementación real
- código de prueba que se haya quedado en rutas productivas
- módulos sin consumidores pero con riesgo de estar expuestos por import dinámico o registro

### Trabajo

1. Revisar el árbol de [src/modules](../../src/modules) y clasificar cada artefacto en:
   - activo y necesario
   - legacy y reemplazable
   - de prueba o soporte temporal
2. Confirmar que cada archivo candidato:
   - no sea usado por runtime
   - no sea importado por tests o scripts
   - no sea parte del contrato público del core
3. Documentar cualquier excepción antes de eliminarla.

### Criterio de salida

- inventario final consolidado
- listado de archivos a conservar, eliminar o mover
- cero cambios de comportamiento

## Fase 2 — Definir la API pública del Core

### Objetivo

Establecer una interfaz estable para el producto, separando lo que es infraestructura interna de lo que es uso externo.

### Propuesta inicial de API

```text
AbielCore
├── Runtime
├── Agent
├── Memory
├── Capability
├── EventBus
└── Tenant
```

### Trabajo

1. Definir un punto de entrada único para el runtime del core.
2. Exponer contratos claros para:
   - ejecución de agentes
   - memoria y contexto
   - capacidades
   - eventos
   - tenant/identity
3. Mantener el diseño orientado a producto, no solo a arquitectura interna.
4. Documentar qué partes son públicas y cuáles siguen siendo internas.

### Criterio de salida

- un conjunto mínimo de entradas públicas documentadas
- un mapa claro de responsabilidades por componente
- estabilidad de importaciones principales

## Fase 3 — Observabilidad

### Objetivo

Hacer que el sistema sea operable en producción: trazable, verificable y observable.

### Trabajo

1. Logging estructurado
   - logs JSON o estructurados por contexto
   - incluir requestId, traceId, tenantId, executionId
2. Métricas
   - conteo de ejecuciones
   - latencia de runtime
   - errores por tipo
   - uso de capacidades y agentes
3. Health checks
   - readiness/liveness
   - verificación de dependencias clave
4. Tracing
   - propagación de contexto entre runtime y eventos
   - correlación entre request y ejecución

### Criterio de salida

- endpoint de salud operativo
- logs con contexto útil
- métricas básicas visibles en runtime
- trazas correlacionadas entre pasos del flujo

## Fase 4 — Preparar v1.0

### Objetivo

Dejar al proyecto listo para ser consumido como base SaaS o plataforma ejecutable.

### Trabajo

1. Revisar README y documentación de uso.
2. Definir un flujo de arranque simple para desarrollo y producción.
3. Preparar una guía de integración mínima.
4. Definir checklist de release para v1.0.
5. Asegurar que los gates de calidad estén en el flujo:
   - tests
   - typecheck
   - auditoría de arquitectura
   - smoke test de runtime

### Criterio de salida

- proyecto con una narrativa clara de producto
- documentación de entrada pública
- checklist de release
- base estable para una versión inicial

## Orden recomendado de ejecución

1. Auditoría final de modules restantes
2. Definición de API pública del core
3. Observabilidad
4. Preparación de v1.0

## Riesgo esperado

- bajo para la auditoría
- medio para la API pública
- medio para observabilidad
- bajo/medio para la preparación de release

## Entregables esperados

- inventario final de deuda residual
- API pública del core documentada
- observabilidad básica operativa
- checklist de preparación para v1.0
