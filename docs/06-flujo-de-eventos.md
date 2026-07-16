# 06 - Flujo de Eventos

# Objetivo

Este documento define el funcionamiento del sistema de eventos de Abiel Core.

Los eventos serán utilizados como mecanismo de comunicación entre módulos, permitiendo que cada contexto reaccione a cambios del sistema sin crear dependencias directas.

El objetivo es mantener una arquitectura desacoplada, escalable y preparada para evolucionar hacia sistemas distribuidos en el futuro.

---

# ¿Qué es un Evento de Dominio?

Un Evento de Dominio representa algo importante que ocurrió dentro del negocio.

Los eventos siempre están escritos en pasado porque describen una acción ya completada.

Ejemplos:

Correctos:

- EmpresaCreada
- UsuarioRegistrado
- MensajeRecibido
- PagoConfirmado

Incorrectos:

- CrearEmpresa
- RegistrarUsuario
- EnviarMensaje

Un evento no ordena realizar una acción.

Un evento informa que una acción ocurrió.

---

# Objetivo de los Eventos

Los eventos permiten que un módulo pueda informar cambios sin conocer quién necesita esa información.

Ejemplo:

El módulo Empresa crea una nueva empresa.

Empresa publica:

EmpresaCreada

Pero no sabe que existen:

- Suscripción
- Notificaciones
- Auditoría

Estos módulos escuchan el evento y reaccionan de manera independiente.

---

# Flujo General de un Evento

El flujo será:

```
Acción del Usuario

↓

Caso de Uso

↓

Dominio

↓

Cambio de Estado

↓

Persistencia

↓

Evento de Dominio

↓

EventBus

↓

Módulos Suscriptores
```

---

# Ejemplo: Empresa Creada

Proceso:

```
Crear Empresa

↓

Empresa.crear()

↓

EmpresaRepository.save()

↓

EmpresaCreada

↓

EventBus.publish()

↓

Suscripción crea plan inicial

↓

Notificaciones envía bienvenida

↓

Auditoría registra acción
```

Cada módulo tiene una responsabilidad diferente.

---

# Componentes del Sistema de Eventos

El sistema estará compuesto por:

## Evento de Dominio

Representa un hecho ocurrido.

Ejemplo:

EmpresaCreada

Responsabilidad:

- Transportar información del cambio.
- Mantener datos inmutables.

---

## Event Publisher

Responsabilidad:

Publicar eventos dentro del sistema.

Ejemplo:

```
eventBus.publish(event)
```

No conoce quién consume el evento.

---

## Event Subscriber

Responsabilidad:

Escuchar eventos específicos y ejecutar una reacción.

Ejemplo:

```
EmpresaCreada
        |
        |
        ↓
CrearSuscripcionInicial
```

---

## Event Bus

Es el intermediario entre productores y consumidores.

Responsabilidades:

- Recibir eventos.
- Encontrar suscriptores.
- Ejecutar handlers.
- Gestionar errores.

---

# Estructura de un Evento

Todos los eventos deberán tener información estándar.

Ejemplo conceptual:

```
Evento

{
 id,
 nombre,
 fecha,
 version,
 datos
}
```

Campos:

## id

Identificador único del evento.

Permite rastrear operaciones.

---

## nombre

Nombre del evento.

Ejemplo:

EmpresaCreada

---

## fecha

Momento en que ocurrió.

Permite auditoría y ordenamiento.

---

## versión

Permite evolucionar eventos sin romper consumidores existentes.

Ejemplo:

EmpresaCreada.v1

EmpresaCreada.v2

---

## datos

Información necesaria para los consumidores.

Debe contener solamente lo necesario.

---

# Reglas de Diseño de Eventos

Los eventos deberán cumplir:

## Inmutabilidad

Después de creados no pueden modificarse.

---

## Independencia

El consumidor no debe conocer la implementación del productor.

---

## Pequeño tamaño

Un evento debe transportar información necesaria, no objetos completos.

---

## Versionado

Los cambios importantes requieren una nueva versión.

---

## Nombres claros

Los nombres deben representar hechos del negocio.

---

# Persistencia y Eventos

Abiel Core utilizará inicialmente persistencia tradicional.

El orden correcto será:

```
1. Ejecutar lógica de dominio

2. Guardar cambios en PostgreSQL

3. Confirmar transacción

4. Publicar evento
```

Nunca se publicará un evento antes de guardar correctamente la información.

---

# Patrón Transactional Outbox

Aunque inicialmente el sistema puede utilizar publicación directa, la arquitectura estará preparada para implementar Transactional Outbox.

Este patrón evita perder eventos cuando ocurre un fallo.

Funcionamiento:

```
Cambio de dominio

↓

Guardar entidad

↓

Guardar evento en tabla Outbox

↓

Proceso externo publica evento

↓

Marca evento como procesado
```

Beneficios:

- Garantiza entrega.
- Evita pérdida de información.
- Permite reintentos.
- Mejora confiabilidad.

---

# Manejo de Errores

Si un consumidor falla:

Ejemplo:

Notificaciones no puede enviar un mensaje.

El sistema deberá:

1. Registrar el error.
2. Mantener el evento.
3. Permitir reintento.
4. No detener otros consumidores.

Un fallo aislado no debe afectar todo el sistema.

---

# Eventos dentro del mismo módulo

Un módulo también puede utilizar eventos internamente.

Ejemplo:

Empresa:

```
EmpresaCreada

↓

ValidarConfiguracionInicial

↓

GenerarConfiguracion
```

Esto mantiene separadas las responsabilidades internas.

---

# Eventos entre módulos

Ejemplo:

```
EmpresaCreada

├── Suscripción
│       |
│       └── Crear Plan
│
├── Notificaciones
│       |
│       └── Enviar Bienvenida
│
└── Auditoría
        |
        └── Registrar Acción
```

Cada consumidor funciona de manera independiente.

---

# Beneficios

El sistema de eventos proporciona:

- Bajo acoplamiento.
- Escalabilidad.
- Facilidad para agregar nuevas funcionalidades.
- Mejor trazabilidad.
- Integración futura con colas y microservicios.

---

# Conclusión

Los eventos son un mecanismo fundamental dentro de Abiel Core para comunicar cambios importantes del negocio.

La arquitectura utilizará eventos de dominio para mantener módulos independientes, permitiendo que la plataforma crezca desde un monolito modular hasta una arquitectura distribuida si el negocio lo requiere.