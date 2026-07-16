# Execution Policy Module

## Objetivo

Definir y aplicar la politica de ejecucion v1 como fuente unica de verdad para control operativo del runtime.

## Componentes implementados

- RetryPolicy
- TimeoutPolicy
- ErrorClassifier
- PermissionChecker

## Alcance V1

- Retry: numero maximo de intentos y tipos de error reintentables.
- Timeout: limite de duracion por ejecucion.
- Permisos: validacion de permisos efectivos requeridos.
- Error Classification: clasificacion estandar de errores de ejecucion.

Taxonomia de errores en v1:

- cancellation_error
- timeout_error
- permission_error
- validation_error
- capability_error

## Integracion

Este modulo es consumido por `RuntimeEngine` para:

- Validar acceso antes de ejecutar capabilities.
- Limitar tiempo de ejecucion.
- Reintentar en errores retryable.
- Emitir resultado con clasificacion consistente.
- Resolver cancelacion con clasificacion `cancellation_error`.

## Fuera de alcance (V2)

- Politicas avanzadas de orquestacion.
- Estrategias semanticas de decision.
- Observabilidad avanzada.
