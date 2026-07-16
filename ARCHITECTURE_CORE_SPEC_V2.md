# ABIEL CORE v1 - CORE SPEC IMPLEMENTABLE (V2)

## Estado del documento

- Tipo: Especificacion tecnica de implementacion.
- Alcance: Solo ABIEL CORE v1.
- Objetivo: Cerrar ambiguedades detectadas en auditoria y habilitar desarrollo en produccion.
- Compatibilidad: Mantiene la arquitectura actual y sus modulos existentes.
- No objetivo: Reescritura completa, rediseno total, ni definicion de tecnologias concretas.

## Principios de esta especificacion

- Un contrato por responsabilidad critica.
- Una fuente de verdad para politica de ejecucion.
- Separacion clara entre rutas de ejecucion.
- Seguridad y aislamiento definidos por comportamiento verificable.
- Simplicidad operativa para entrega de v1.

---

## 1) CORE RUNTIME

### Rol

El Core Runtime es el orquestador de ejecucion de una solicitud. No implementa la logica de negocio de capacidades; coordina contratos.

### Que recibe

- Event de entrada normalizado.
- Identidad de tenancy y actor de ejecucion.
- Metadatos de canal y conversacion.
- Politica de ejecucion aplicable (por defecto o explicita).

### Que procesa

- Construccion del Decision Context.
- Validacion de permisos y politicas.
- Seleccion del pipeline de ejecucion.
- Invocacion de capability o workflow.
- Consolidacion de resultado y telemetria de auditoria.

### Que devuelve

- Result Event normalizado.
- Estado final de ejecucion: success, failed, cancelled, timeout, blocked.
- Metadatos de trazabilidad: executionId, timestamps, policy aplicada.

### Ciclo de vida de una ejecucion

Flujo obligatorio:

Event
↓
Runtime
↓
Decision Context
↓
Policy Check
↓
Execution Pipeline
↓
Capability
↓
Result Event

Fases operativas:

1. Ingreso: Runtime recibe Event y asigna executionId.
2. Contexto: Runtime crea Decision Context inmutable para esta ejecucion.
3. Politica: Runtime evalua permisos y Execution Policy.
4. Ruta: Runtime selecciona un pipeline (Direct, Planned, Workflow).
5. Ejecucion: Pipeline invoca capacidades bajo contrato.
6. Cierre: Runtime publica Result Event y persiste auditoria minima.

Invariantes:

- Una ejecucion corresponde a un solo executionId.
- Decision Context no muta durante la corrida.
- Todo acceso a capability pasa por Policy Check.
- Todo final produce Result Event, incluso en error o cancelacion.

---

## 2) DECISION CONTEXT

### Contrato central

Decision Context es el snapshot inmutable y tenant-isolated usado para decidir y ejecutar.

Campos obligatorios:

- executionId: Identificador unico de ejecucion.
- tenantId: Identificador de aislamiento de tenant.
- agentId: Identificador de agente que ejecuta.
- userId: Identificador de usuario originador.
- conversationId: Identificador de conversacion.
- eventType: Tipo de evento de entrada que dispara la ejecucion.
- inputPayload: Carga normalizada de entrada para decision y ejecucion.
- sourceChannel: Origen del evento (canal o integracion).
- requestedAction: Accion solicitada al Core (si aplica).
- availableCapabilities: Lista de capacidades disponibles para esta ejecucion.
- permissions: Permisos efectivos ya resueltos para esta ejecucion.
- policySnapshot: Snapshot inmutable de la Execution Policy efectiva.
- authContext: Contexto de identidad y autorizacion efectiva de la solicitud.
- memory: Estado de memoria permitido para esta ejecucion.
- memoryWindow: Ventana de memoria incluida en esta ejecucion.
- correlationId: Identificador de correlacion transversal.
- traceId: Identificador de trazabilidad de la ejecucion.
- metadata: Datos de soporte (timestamps, prioridad, origen tecnico).

### Quien lo crea

- Lo crea exclusivamente el Runtime al inicio de cada ejecucion.

### Quien lo consume

- Policy Check para autorizacion y limites.
- Execution Pipelines para decidir ruta de ejecucion.
- Planned Execution para seleccion de accion/capability.
- Capabilities para ejecutar con contexto controlado.
- Memory para lectura/escritura permitida por ventana.
- Security para enforcement y auditoria.

### Reglas de contrato

- Inmutable durante toda la ejecucion.
- No puede contener datos de otro tenant.
- Solo incluye memoria y permisos ya autorizados.
- Debe existir antes de cualquier invocacion de capability.

---

## 3) EXECUTION PIPELINES

Se definen solo tres pipelines para eliminar ambiguedad.

### A) Direct Execution

Cuando usarlo:

- Acciones simples, deterministas y sin decision asistida.
- Casos de transformacion, validacion, consulta o accion puntual.

Componentes involucrados:

- Runtime
- Decision Context
- Policy Check
- Capability
- Result Event

Ejemplo real:

- Usuario solicita actualizar una preferencia de perfil ya permitida.
- Runtime valida permisos, ejecuta capability de perfil y devuelve confirmacion.

### B) Planned Execution

Cuando usarlo:

- Cuando se requiere decision dinamica para elegir accion o secuencia corta.
- Casos donde la solicitud es ambigua o requiere interpretacion contextual.

Componentes involucrados:

- Runtime
- Decision Context
- Policy Check
- Planned Decision Engine
- Capability seleccionada
- Result Event

Ejemplo real:

- Usuario pide "resumeme la conversacion y genera una accion siguiente".
- Planned Decision Engine decide capacidad de resumen y luego capacidad de tarea.

### Contrato formal de Planned Execution

Input:

- Decision Context completo e inmutable.
- requestedAction e inputPayload normalizados.
- policySnapshot y permissions efectivas.

Output:

- Plan de ejecucion corto con capacidad(es) seleccionada(s).
- Razon de decision auditable.
- Estado de salida: success o failed.

Ownership:

- Runtime es owner de entrada, invocacion y cierre.
- Planned Decision Engine es owner de la decision dentro del pipeline.
- Capability ejecuta accion final bajo policy.

Fallback:

- Si no hay decision valida, Runtime aplica fallback definido en policySnapshot.
- Si fallback no aplica, termina en failed con motivo auditable.

Errores:

- decision_error: no se pudo decidir ruta/capability.
- policy_violation: decision o accion bloqueada por policy.
- capability_unavailable: capacidad requerida no activa.
- execution_error: error durante ejecucion de capability.

### C) Workflow Execution

Cuando usarlo:

- Procesos largos, multi-paso, con estado y posible reanudacion.
- Casos con esperas externas o puntos de control.

Componentes involucrados:

- Runtime
- Decision Context
- Policy Check
- Workflow Orchestrator
- Capabilities por paso
- Result Event por estado de avance y cierre

Ejemplo real:

- Proceso de onboarding con validaciones, aprobaciones y notificacion final.
- Cada paso se ejecuta con politicas y estado trazable.

Regla de seleccion:

- Runtime selecciona pipeline con base en eventType, requestedAction y policySnapshot.
- La seleccion queda auditada dentro del Result Event.

---

## 4) CAPABILITY SYSTEM

### Contrato de capability

Cada capability debe declarar:

- nombre: Identificador funcional estable.
- version: Version del contrato de capability.
- input: Estructura de entrada validable.
- output: Estructura de salida validable.
- permisos: Permisos requeridos para ejecutar.
- lifecycle: Estado operativo de la capability.

### Reglas operativas

- No se ejecuta capability sin validacion de permisos.
- Input y output se validan contra contrato declarado.
- Version de capability debe ser compatible con Core v1.

### Lifecycle de capability

Estados permitidos:

- registered: Declarada y visible.
- active: Ejecutable.
- suspended: Temporalmente no ejecutable.
- deprecated: Ejecutable con advertencia.
- retired: No ejecutable.

Transiciones controladas:

- registered -> active
- active -> suspended
- active -> deprecated
- deprecated -> retired
- suspended -> active

---

## 5) HUMAN INTERVENTION (DOMINIO PROPIO)

Este modulo se mantiene como dominio separado del Runtime y del Planned Execution.

### State machine formal

Estados:

- bot_active
- human_detected
- temp_blocked
- learning_during_intervention
- auto_reactivated
- permanent_blocked

Eventos:

- human_signal_detected
- temporary_block_requested
- permanent_block_requested
- human_decision_recorded
- temporary_block_timeout_reached
- reactivation_condition_met
- admin_unlock

Transiciones y condiciones:

- bot_active -> human_detected
  - Evento: human_signal_detected
  - Condicion: senal valida de intervencion humana.

- human_detected -> temp_blocked
  - Evento: temporary_block_requested
  - Condicion: policy permite bloqueo temporal.

- human_detected -> permanent_blocked
  - Evento: permanent_block_requested
  - Condicion: policy exige takeover permanente o riesgo alto.

- temp_blocked -> learning_during_intervention
  - Evento: human_decision_recorded
  - Condicion: existe accion humana auditable.

- learning_during_intervention -> temp_blocked
  - Evento: human_decision_recorded
  - Condicion: intervencion continua en ventana activa.

- temp_blocked -> auto_reactivated
  - Evento: temporary_block_timeout_reached o reactivation_condition_met
  - Condicion: bloqueo temporal expiro o criterio automatico cumplido.

- auto_reactivated -> bot_active
  - Evento: reactivation_condition_met
  - Condicion: policy y permisos validos para retomar automatizacion.

- permanent_blocked -> bot_active
  - Evento: admin_unlock
  - Condicion: desbloqueo administrativo explicito.

Reglas:

- Toda transicion genera evento auditable.
- Durante temp_blocked y permanent_blocked, el bot no ejecuta respuestas autonomas.
- learning_during_intervention registra conocimiento sin alterar contratos base.

---

## 6) MEMORY

### MVP v1

Solo se implementan dos niveles:

- Conversacion actual: contexto acotado de la sesion activa.
- Historial: registro persistente de interacciones pasadas consultables.

Reglas de uso:

- Decision Context consume solo memoria autorizada por tenant y permisos.
- Escrituras de memoria ocurren al cierre de ejecucion y eventos de intervencion humana.

### Futuro (fuera de v1)

- Embeddings.
- Memoria semantica.

Nota de alcance:

- v1 no depende de mecanismos semanticos para operar correctamente.

---

## 7) PLUGIN SYSTEM

El sistema de plugins se define por contratos y enforcement de permisos. No se define sandboxing fuerte de proceso en v1.

### Manifest obligatorio

Cada plugin debe declarar:

- pluginName
- pluginVersion
- capabilities expuestas
- permisos solicitados
- compatibilidad con Core

### Permisos

- Todo plugin opera con permisos minimos necesarios.
- Permisos se validan en registro y en tiempo de ejecucion.

### Version

- El plugin declara version propia y rango de compatibilidad.
- Registro rechaza plugins incompatibles.

### Registro

- Registro valida manifest, permisos, version y colisiones de nombre.
- Solo plugins registrados pueden activar capabilities.

### Lifecycle de plugin

Estados permitidos:

- discovered
- validated
- registered
- active
- suspended
- retired

Regla de seguridad v1:

- Seguridad se aplica por API controlada, policy enforcement y auditoria, no por promesa de sandbox total.

---

## 8) EXECUTION POLICY (CONTRATO UNICO)

Execution Policy es la unica fuente de verdad para control de ejecucion.

### Campos obligatorios

- retry:
  - cantidad maxima
  - estrategia de backoff
  - condiciones reintentables

- timeout:
  - duracion maxima por ejecucion
  - duracion maxima por paso (si aplica)

- cancelacion:
  - condiciones de cancelacion aceptadas
  - modo de parada (graceful o inmediata)

- permisos:
  - permisos efectivos requeridos por accion
  - reglas de bloqueo por falta de permiso

- limites:
  - cuotas de recursos
  - limites de concurrencia

- errorClassification:
  - retryable_error
  - non_retryable_error
  - policy_error
  - timeout_error
  - cancellation_error
  - capability_error

### Reglas de fuente unica de verdad

- Scheduler, Runtime, Planned Execution y Workflow no deben redefinir politicas paralelas.
- Toda ejecucion recibe una policy efectiva (default o especifica).
- Retry, timeout, cancelacion, permisos y clasificacion de errores se resuelven solo desde Execution Policy.
- Violaciones de policy finalizan en estado failed o cancelled con auditoria.

---

## 9) SECURITY

### Tenant isolation

- Todo acceso a datos y memoria se filtra por tenantId.
- Decision Context y capabilities operan bajo aislamiento estricto.
- Ninguna operacion puede cruzar fronteras de tenant.

### Permisos

- Modelo de minimo privilegio para agentes, usuarios, capabilities y plugins.
- Permisos se evaluan antes de ejecutar y durante operaciones sensibles.

### Secrets contract

Almacenamiento:

- Los secretos se almacenan como datos de alta sensibilidad bajo frontera de tenant.
- El Core no expone secretos en eventos, respuestas ni metadata de negocio.

Acceso:

- Acceso solo por componentes autorizados y bajo permisos efectivos.
- Todo acceso a secreto debe estar ligado a executionId, tenantId y motivo de uso.

Rotacion:

- Los secretos deben soportar rotacion sin requerir cambio de arquitectura.
- La rotacion invalida usos previos segun policy y alcance configurado.

Auditoria:

- Toda lectura, uso, rotacion o revocacion de secreto genera evento auditable.
- La auditoria de secretos incluye actor, tenant, momento y resultado.

Aislamiento por tenant:

- Un secreto pertenece a un unico tenant.
- No se permite reutilizacion de secretos entre tenants.

### Auditoria

Se registra como minimo:

- quien ejecuto (userId, agentId)
- que se ejecuto (pipeline, capability, plugin)
- cuando se ejecuto (timestamps)
- con que policy y permisos
- resultado final y motivo de error/cancelacion

Objetivo:

- Trazabilidad operativa y cumplimiento sin acoplarse a una tecnologia concreta.

---

## 10) MVP VS FUTURO

### CORE V1 (construir ahora)

- Runtime con flujo obligatorio cerrado.
- Decision Context con contrato inmutable definido y completo para ejecucion.
- Tres Execution Pipelines: Direct, Planned, Workflow.
- Capability System con contrato y lifecycle.
- Human Intervention como dominio propio con state machine formal.
- Memory MVP: conversacion actual + historial.
- Plugin System con manifest, permisos, version, registro y lifecycle.
- Execution Policy unico para retry, timeout, cancelacion, permisos, limites y errores.
- Security base: tenant isolation, permisos, secrets contract y auditoria.

### CORE V2 (posponer)

- Embeddings y memoria semantica.
- Sandboxing fuerte de plugins a nivel de proceso.
- Mecanismos avanzados de optimizacion de decision.
- Extensiones de gobernanza y compatibilidad avanzada.

---

## Compatibilidad con arquitectura actual

- Se preservan modulos existentes y su rol general.
- Se elimina ambiguedad de contratos, no se reemplaza la vision arquitectonica.
- Este documento actua como especificacion operativa para implementar v1.

## Criterio de salida de este documento

La implementacion puede iniciar cuando:

- Todos los equipos acuerdan estos contratos como baseline.
- Ningun modulo v1 queda sin owner ni sin criterio de aceptacion.
- Las dependencias entre Runtime, Policy, Pipelines y Capability quedan planificadas.
