# 05 - Eventos de Dominio del Módulo Empresa

# Objetivo

Este documento define los eventos de dominio generados por el módulo Empresa.

Los eventos representan hechos importantes que ocurrieron dentro del negocio.

Un evento no ordena una acción.

Un evento comunica:

> "Algo importante ya ocurrió."

---

# Concepto de Evento de Dominio

Dentro de Domain Driven Design, un evento de dominio representa un cambio significativo en el estado del negocio.

Ejemplo:

Cuando una empresa es creada:

No decimos:

```
CrearEmpresaEvento
```

Decimos:

```
EmpresaCreada
```

Porque representa un hecho ocurrido.

---

# Responsabilidad de los Eventos

Los eventos permiten:

- Desacoplar módulos.
- Comunicar cambios.
- Crear procesos secundarios.
- Escalar la arquitectura.

Ejemplo:

```
Empresa

   |
   |
   ▼

EmpresaCreada

   |
   |
   ├── Módulo Usuario crea administrador inicial
   |
   ├── Módulo Notificación envía bienvenida
   |
   └── Módulo Auditoría registra actividad
```

---

# Principios de Eventos

Los eventos deben ser:

## Inmutables

Una vez creados no cambian.

Ejemplo:

Incorrecto:

```
EmpresaCreada.nombre = "Nuevo"
```

Correcto:

Crear un nuevo evento.

---

## Representar hechos

Incorrecto:

```
ActivarEmpresa
```

Porque es una orden.

Correcto:

```
EmpresaActivada
```

Porque representa un hecho.

---

## Independientes

Un evento no debe conocer quién lo consume.

Ejemplo:

Empresa no sabe que existe:

- Usuario.
- Notificaciones.
- Facturación.

---

# Ubicación dentro del módulo

Los eventos estarán en:

```
empresa/

└── domain/

    └── events/
```

---

# Eventos del Módulo Empresa

Inicialmente tendremos:

```
EmpresaCreada

EmpresaActualizada

EmpresaActivada

EmpresaSuspendida

EmpresaCancelada
```

---

# 1. Evento EmpresaCreada

## Descripción

Se genera cuando una nueva empresa fue creada correctamente.

---

## Momento de creación

Flujo:

```
CrearEmpresa

↓

Empresa creada

↓

EmpresaCreada
```

---

## Información del evento

Debe contener:

```
empresaId

nombre

fechaCreacion
```

---

## Consumidores posibles

Otros módulos pueden escuchar:

```
EmpresaCreada

↓

Usuario

↓

Crear usuario administrador

```

```
EmpresaCreada

↓

Notificación

↓

Enviar bienvenida
```

---

# 2. Evento EmpresaActualizada

## Descripción

Representa un cambio en información empresarial.

---

## Ejemplo

Antes:

```
Nombre:
Barbería Santos
```

Después:

```
Nombre:
Santos Barber Shop
```

---

## Información

Puede contener:

```
empresaId

camposModificados

fechaActualizacion
```

---

# 3. Evento EmpresaActivada

## Descripción

Se genera cuando una empresa pasa al estado ACTIVA.

---

## Flujo

```
Empresa

PENDIENTE

↓

activar()

↓

ACTIVA

↓

EmpresaActivada
```

---

## Consumidores posibles

Ejemplo:

```
EmpresaActivada

↓

Módulo IA

↓

Crear configuración inicial
```

---

# 4. Evento EmpresaSuspendida

## Descripción

Indica que una empresa dejó temporalmente de operar.

---

## Ejemplos

- Falta de pago.
- Suspensión administrativa.
- Revisión de cuenta.

---

## Consumidores posibles

```
EmpresaSuspendida

↓

WhatsApp

↓

Bloquear automatizaciones
```

---

# 5. Evento EmpresaCancelada

## Descripción

Representa la finalización definitiva de una empresa dentro del sistema.

---

## Importante

No significa borrar datos.

Significa:

```
Estado = CANCELADA
```

---

# Flujo General de Eventos

Ejemplo:

```
Caso de Uso

      |

      ▼

Entidad Empresa

      |

      ▼

Cambio válido

      |

      ▼

Evento de Dominio

      |

      ▼

EventBus

      |

      ▼

Suscriptores
```

---

# Eventos vs Commands

Es importante diferenciar:

## Command

Representa una intención.

Ejemplo:

```
ActivarEmpresa
```

Significa:

"Quiero activar una empresa."

---

## Event

Representa un hecho.

Ejemplo:

```
EmpresaActivada
```

Significa:

"La empresa ya fue activada."

---

# Reglas para crear nuevos eventos

Antes de crear un evento debe preguntarse:

## ¿Es importante para el negocio?

Si no:

No crear evento.

---

## ¿Otro módulo necesita saberlo?

Si no:

Probablemente no necesita evento.

---

## ¿Representa algo ocurrido?

Debe estar escrito en pasado.

Ejemplo:

Correcto:

```
UsuarioCreado
```

Incorrecto:

```
CrearUsuario
```

---

# Integración con Event Driven Architecture

El módulo Empresa no llamará directamente otros módulos.

Ejemplo incorrecto:

```
Empresa

↓

EnviarCorreo()
```

---

Ejemplo correcto:

```
Empresa

↓

EmpresaCreada

↓

EventBus

↓

Servicio de correo
```

---

# Persistencia de Eventos

Inicialmente:

Los eventos serán procesados en memoria mediante EventBus interno.

Futuro:

Podrán evolucionar hacia:

- RabbitMQ.
- Kafka.
- NATS.
- Event Store.

---

# Auditoría

Los eventos permiten mantener historial.

Ejemplo:

```
EmpresaCreada

2026-01-01


EmpresaSuspendida

2026-03-01


EmpresaActivada

2026-04-01
```

---

# Pruebas necesarias

Cada evento debe probar:

- Creación correcta.
- Datos obligatorios.
- Inmutabilidad.
- Publicación correcta.

---

# Resumen

El módulo Empresa generará:

```
EmpresaCreada

EmpresaActualizada

EmpresaActivada

EmpresaSuspendida

EmpresaCancelada
```

Los eventos permitirán que Abiel Core crezca utilizando comunicación desacoplada entre módulos.

---

# Conclusión

Los eventos de dominio son la base para que Abiel Core pueda evolucionar desde un monolito modular hacia una arquitectura distribuida sin modificar el núcleo del negocio.