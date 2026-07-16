# 08 - Integraciones del Módulo Empresa

# Objetivo

Este documento define cómo el módulo Empresa se comunica con otros módulos internos y servicios externos dentro de Abiel Core.

El objetivo principal es mantener un sistema desacoplado donde cada módulo tenga sus propias responsabilidades.

El módulo Empresa debe poder evolucionar sin depender directamente de otros módulos.

---

# Principio de Integración

La comunicación entre módulos debe realizarse principalmente mediante:

- Eventos de dominio.
- Contratos.
- Interfaces.

No mediante llamadas directas entre módulos.

---

# Regla Principal

Empresa no debe conocer detalles de otros módulos.

Ejemplo incorrecto:

```
Empresa

↓

UsuarioService

↓

Crear usuario
```

Problema:

El módulo Empresa queda acoplado.

---

Forma correcta:

```
Empresa

↓

EmpresaCreada

↓

EventBus

↓

Usuario escucha evento
```

---

# Arquitectura de Comunicación

Flujo:

```
                 Empresa Module


                      |

                      |

              Domain Event

                      |

                      |

                  EventBus

                      |

        ----------------------------

        |             |            |

     Usuario     Facturación    IA

```

---

# Integración con Módulo Usuario

## Objetivo

Crear y administrar usuarios relacionados con una empresa.

---

# Relación

Una empresa puede tener múltiples usuarios.

Modelo:

```
Empresa

   |

   |

 Usuarios
```

---

# Comunicación

Cuando se crea una empresa:

Evento:

```
EmpresaCreada
```

Usuario puede escuchar:

```
EmpresaCreada

↓

Crear usuario administrador inicial
```

---

# Responsabilidad de Usuario

El módulo Usuario decide:

- Cómo crear usuarios.
- Roles.
- Permisos.
- Autenticación.

Empresa no interviene.

---

# Integración con Módulo Suscripción

## Objetivo

Gestionar planes SaaS.

Ejemplo:

- Básico.
- Profesional.
- Empresarial.

---

# Comunicación

Cuando una empresa es creada:

```
EmpresaCreada

↓

Suscripción

↓

Crear plan inicial
```

---

# Empresa no debe saber:

- Precio.
- Facturación.
- Límites del plan.

Eso pertenece a Suscripción.

---

# Integración con Facturación

## Objetivo

Gestionar pagos y estados financieros.

---

# Comunicación

Ejemplo:

Pago aprobado:

```
PagoConfirmado

↓

Empresa

↓

Activar servicio
```

---

Pero Empresa no llama:

```
Facturacion.confirmarPago()
```

---

# Integración con Módulo IA

## Objetivo

Configurar asistentes inteligentes para cada empresa.

---

# Comunicación inicial

Cuando una empresa está activa:

Evento:

```
EmpresaActivada
```

IA puede reaccionar:

```
EmpresaActivada

↓

Crear configuración IA inicial
```

---

# Información compartida

IA puede necesitar:

```
empresaId

nombreEmpresa

configuracionInicial
```

---

# Integración con Conversaciones

## Objetivo

Gestionar conversaciones de clientes.

---

# Relación

Cada conversación pertenece a una empresa.

Modelo:

```
Empresa

 |

 Conversación

 |

 Mensajes
```

---

# Regla Multi-Tenant

Toda conversación debe tener:

```
empresaId
```

---

# Comunicación

Cuando una empresa es suspendida:

```
EmpresaSuspendida

↓

Conversaciones

↓

Desactivar automatizaciones
```

---

# Integración con WhatsApp

## Objetivo

Conectar empresas con canales externos.

Ejemplo:

- WhatsApp Business.
- Evolution API.

---

# Comunicación

Empresa activa:

```
EmpresaActivada

↓

WhatsApp Module

↓

Crear conexión
```

---

# Empresa no conoce:

- Tokens.
- QR.
- API externa.

Eso pertenece al módulo WhatsApp.

---

# Integración con Notificaciones

## Objetivo

Enviar mensajes al usuario.

---

# Ejemplo

Empresa creada:

```
EmpresaCreada

↓

Notificación

↓

Enviar bienvenida
```

---

# Integración con Auditoría

## Objetivo

Registrar acciones importantes.

---

# Ejemplo:

```
EmpresaSuspendida

↓

Auditoría

↓

Guardar historial
```

---

# Contratos de Integración

Los eventos deben tener información mínima necesaria.

Ejemplo:

Evento:

```
EmpresaCreada
```

Datos:

```
empresaId

nombre

fechaCreacion
```

---

# No incluir información innecesaria

Incorrecto:

```
EmpresaCreada

usuarios completos

configuración IA

datos financieros
```

---

Correcto:

Solo información necesaria para reaccionar.

---

# Eventos Externos Recibidos

Empresa puede recibir eventos de otros módulos.

Ejemplo:

```
PagoFallido

↓

Empresa

↓

Suspender servicio
```

---

# Regla

Los eventos externos deben transformarse en acciones del dominio.

Ejemplo:

Incorrecto:

```
PagoHandler

empresa.estado = suspendida
```

Correcto:

```
PagoHandler

↓

SuspenderEmpresa UseCase

↓

Empresa.suspender()
```

---

# Escalabilidad Futura

Actualmente:

```
EventBus interno
```

Futuro:

```
RabbitMQ

Kafka

NATS
```

La lógica del módulo no cambia.

---

# Seguridad

Toda comunicación debe validar:

- Empresa correcta.
- Permisos.
- Identidad del emisor.
- Datos recibidos.

---

# Resumen

El módulo Empresa se integra mediante:

```
Eventos

Contratos

Casos de uso
```

Nunca mediante dependencias directas.

---

# Conclusión

El diseño de integraciones permite que Abiel Core crezca como plataforma SaaS modular.

Cada módulo mantiene autonomía y el sistema puede evolucionar hacia una arquitectura distribuida cuando sea necesario.