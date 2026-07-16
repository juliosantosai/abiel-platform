# Reglas de estado de Empresa

## Estados disponibles

- **PENDIENTE**
  - Empresa registrada pero aún no completó onboarding.
  - Estado inicial por defecto cuando la cuenta todavía no puede usar la plataforma.
  - Indica que la empresa existe en el SaaS pero aún no está operativa.

- **ACTIVA**
  - Empresa operativa dentro del SaaS.
  - Estado que permite a la empresa realizar operaciones normales.
  - Corresponde a una empresa habilitada y en funcionamiento.

- **SUSPENDIDA**
  - Empresa temporalmente bloqueada.
  - Estado usado cuando la empresa no puede operar por un periodo limitado.
  - Mantiene la empresa en el sistema para poder reactivar su actividad.

- **CANCELADA**
  - Estado final.
  - Empresa dada de baja permanentemente.
  - No puede volver a estados anteriores ni reactivarse.

## Tabla de transiciones permitidas

| Origen     | Destino     | Permiso   | Comentario |
|------------|-------------|-----------|------------|
| PENDIENTE  | ACTIVA      | permitido | Activación tras completar onboarding.
| PENDIENTE  | SUSPENDIDA  | prohibido | Una cuenta pendiente no puede suspenderse.
| PENDIENTE  | CANCELADA   | permitido | Cancelación directa antes de activación.
| ACTIVA     | SUSPENDIDA  | permitido | Suspensión temporal por falta de pago, revisión o bloqueo administrativo.
| ACTIVA     | CANCELADA   | permitido | Cancelación definitiva de una cuenta activa.
| SUSPENDIDA | ACTIVA      | permitido | Reactivación después de la suspensión.
| SUSPENDIDA | CANCELADA   | permitido | Cancelación definitiva después de la suspensión.
| CANCELADA  | ACTIVA      | prohibido | Una empresa cancelada no puede volver a activarse.
| CANCELADA  | SUSPENDIDA  | prohibido | Una empresa cancelada no puede ser suspendida.
| CANCELADA  | CANCELADA   | permitido | La cancelación es idempotente.

## Reglas de negocio

- La entidad `Empresa` expone los siguientes métodos para cambiar de estado:
  - `activar()`
  - `suspender()`
  - `cancelar()`
  - `eliminar()` (alias de `cancelar()`)

- Los métodos que modifican estado son:
  - `activar()` cambia el estado a `ACTIVA`.
  - `suspender()` cambia el estado a `SUSPENDIDA`.
  - `cancelar()` cambia el estado a `CANCELADA`.

- Comportamiento de valores inválidos:
  - `activar()` lanza `DomainError` cuando el estado actual es `CANCELADA`.
  - `suspender()` lanza `DomainError` cuando el estado actual es `CANCELADA`.
  - `cancelar()` es seguro y idempotente: si la empresa ya está cancelada no realiza cambios adicionales.

- Estados que pueden modificarse:
- Desde `PENDIENTE` se puede transitar a `ACTIVA` o `CANCELADA`.
  - Desde `ACTIVA` se puede transitar a `SUSPENDIDA` o `CANCELADA`.
  - Desde `SUSPENDIDA` se puede transitar a `ACTIVA` o `CANCELADA`.
  - Desde `CANCELADA` no se permite regresar a ningún estado no final.

- Operaciones que deben rechazar cambios inválidos:
  - No está permitido reactivar una empresa cancelada.
  - No está permitido suspender una empresa cancelada.
  - Los métodos de estado no revisan explícitamente `PENDIENTE` o `SUSPENDIDA` para `activar()` y `suspender()`, pero la lógica de negocio asume transiciones implícitas desde esos estados.

## Eventos relacionados

- `EmpresaActivada`
  - Ocurre cuando se invoca `activar()` y la empresa pasa a `ACTIVA`.

- `EmpresaSuspendida`
  - Ocurre cuando se invoca `suspender()` y la empresa pasa a `SUSPENDIDA`.

- `EmpresaCancelada`
  - Ocurre cuando se invoca `cancelar()` o `eliminar()` y la empresa entra en `CANCELADA`.
