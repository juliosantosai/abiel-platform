# 05 - Flujo entre Módulos

# Objetivo

Este documento define cómo se comunican los módulos dentro de Abiel Core.

La comunicación entre módulos es uno de los aspectos más importantes de la arquitectura, ya que garantiza un sistema desacoplado, escalable y fácil de mantener.

Ningún módulo podrá acceder directamente a la implementación interna de otro módulo.

---

# Principios

Toda comunicación deberá cumplir las siguientes reglas:

- Cada módulo es independiente.
- Ningún módulo accederá directamente a la base de datos de otro.
- Ningún módulo utilizará las entidades internas de otro módulo.
- Ningún módulo conocerá la infraestructura de otro módulo.
- La comunicación se realizará mediante contratos o eventos.

---

# Tipos de Comunicación

Abiel Core utilizará únicamente dos mecanismos de comunicación entre módulos.

## 1. Comunicación Síncrona

Se utiliza cuando un módulo necesita una respuesta inmediata.

Esta comunicación se realiza mediante un Caso de Uso público.

Ejemplo:

Conversación necesita conocer la configuración de una Empresa.

Flujo:

Conversación

↓

ObtenerEmpresa

↓

Empresa

↓

Respuesta

La llamada es directa y el resultado es inmediato.

---

## 2. Comunicación Asíncrona

Se utiliza cuando un módulo solo necesita informar que ocurrió un hecho.

Esta comunicación se realiza mediante Eventos de Dominio.

Ejemplo:

EmpresaCreada

↓

Suscripción

↓

Notificaciones

↓

Auditoría

El módulo que genera el evento no conoce quién lo recibirá.

---

# Flujo General

Todo flujo dentro del sistema seguirá el siguiente recorrido:

Cliente

↓

Interfaces

↓

Caso de Uso

↓

Dominio

↓

Repositorio

↓

Base de Datos

↓

Evento

↓

Otros módulos

---

# Ejemplo 1: Creación de una Empresa

Solicitud HTTP

↓

EmpresaController

↓

CrearEmpresa

↓

Empresa

↓

EmpresaRepository

↓

PostgreSQL

↓

EmpresaCreada

↓

EventBus

↓

Suscripción

↓

Notificaciones

↓

Auditoría

En este flujo:

- El módulo Empresa solo crea la empresa.
- Suscripción crea el plan inicial.
- Notificaciones envía el mensaje de bienvenida.
- Auditoría registra la acción.

Empresa no conoce ninguno de esos procesos.

---

# Ejemplo 2: Recepción de un Mensaje

Webhook WhatsApp

↓

Canal

↓

Mensaje

↓

Conversación

↓

IA

↓

Respuesta generada

↓

Canal

↓

WhatsApp

Cada módulo participa únicamente en la parte del proceso que le corresponde.

---

# Dependencias Permitidas

Las dependencias permitidas entre módulos son:

- Casos de Uso públicos.
- Eventos de Dominio.

No se permiten dependencias directas entre:

- Entidades.
- Repositorios.
- Adaptadores.
- Infraestructura.

---

# Flujo de Eventos

Los eventos representan hechos ya ocurridos.

Ejemplo:

EmpresaCreada

↓

EventBus

↓

Suscripción

↓

PlanContratado

↓

EventBus

↓

Notificaciones

↓

Auditoría

Un evento puede generar nuevos eventos.

Esto permite construir procesos complejos manteniendo el desacoplamiento.

---

# Reglas para Eventos

Todo evento deberá cumplir las siguientes reglas:

- Representar un hecho del pasado.
- Ser inmutable.
- Tener un nombre descriptivo.
- Contener únicamente la información necesaria.
- No ejecutar lógica de negocio.

Ejemplos:

Correcto:

- EmpresaCreada
- UsuarioRegistrado
- MensajeRecibido

Incorrecto:

- CrearEmpresa
- RegistrarUsuario
- EnviarMensaje

Los eventos describen lo que ya ocurrió, no lo que debe ocurrir.

---

# Manejo de Errores

Si un módulo falla al procesar un evento:

- El evento original no se pierde.
- El error se registra.
- El resto de módulos continúa funcionando.
- El sistema podrá reintentar el procesamiento posteriormente.

Esto evita que un error en un módulo afecte a todo el sistema.

---

# Beneficios

Este modelo de comunicación proporciona:

- Bajo acoplamiento.
- Alta cohesión.
- Mayor escalabilidad.
- Facilidad para incorporar nuevos módulos.
- Mejor tolerancia a fallos.
- Mayor facilidad para realizar pruebas.

---

# Conclusión

La comunicación entre módulos de Abiel Core se basa en casos de uso y eventos de dominio.

Este enfoque permite construir un sistema flexible, desacoplado y preparado para crecer sin generar dependencias innecesarias entre los distintos contextos del negocio.