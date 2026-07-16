# 03 - Bounded Contexts

# Objetivo

Este documento define los Bounded Contexts de Abiel Core.

Cada Bounded Context representa un área específica del negocio con responsabilidades bien delimitadas, su propio modelo de dominio y su propio lenguaje ubicuo.

El objetivo es evitar que el crecimiento del sistema genere un dominio confuso o altamente acoplado.

---

# ¿Qué es un Bounded Context?

Un Bounded Context es un límite lógico dentro del sistema donde un modelo de negocio tiene un significado único y consistente.

Dentro de un contexto:

- Existe un lenguaje común.
- Las reglas de negocio son coherentes.
- Las entidades tienen un significado específico.
- Los casos de uso pertenecen únicamente a ese contexto.

Cada contexto debe poder evolucionar sin afectar directamente a los demás.

---

# Principios

Todos los Bounded Contexts deberán cumplir las siguientes reglas:

- Tendrán una única responsabilidad de negocio.
- Tendrán su propio dominio.
- Tendrán su propia aplicación.
- Tendrán su propia infraestructura.
- Tendrán sus propios eventos.
- No accederán directamente a las entidades de otro contexto.

La comunicación entre contextos se realizará mediante eventos o casos de uso públicos.

---

# Lenguaje Ubicuo (Ubiquitous Language)

Cada contexto definirá un vocabulario común entre el negocio y el desarrollo.

Ejemplo:

En el contexto Empresa:

- Empresa
- Plan
- Estado
- Activación

En el contexto Conversación:

- Conversación
- Mensaje
- Canal
- Sesión

Los nombres utilizados en el código deberán reflejar exactamente este lenguaje.

No se utilizarán nombres ambiguos o genéricos.

---

# Bounded Contexts Iniciales

## Empresa

Responsabilidad:

Administrar la información principal de cada empresa cliente.

Incluye:

- Registro de empresa
- Estado
- Configuración general
- Plan contratado

Eventos:

- EmpresaCreada
- EmpresaActualizada
- EmpresaActivada

---

## Usuario

Responsabilidad:

Administrar los usuarios pertenecientes a una empresa.

Incluye:

- Registro
- Autenticación
- Roles
- Permisos

Eventos:

- UsuarioRegistrado
- UsuarioActualizado
- UsuarioEliminado

---

## IA

Responsabilidad:

Administrar la configuración y comportamiento de los asistentes inteligentes.

Incluye:

- Personalidad
- Prompts
- Configuración del modelo
- Parámetros de generación

Eventos:

- IAConfigurada
- PromptActualizado

---

## Conversación

Responsabilidad:

Gestionar el ciclo de vida de las conversaciones.

Incluye:

- Inicio
- Estado
- Finalización
- Historial

Eventos:

- ConversacionIniciada
- ConversacionFinalizada

---

## Mensaje

Responsabilidad:

Gestionar los mensajes enviados y recibidos.

Incluye:

- Recepción
- Envío
- Estado
- Historial

Eventos:

- MensajeRecibido
- MensajeEnviado

---

## Canal

Responsabilidad:

Administrar los diferentes canales de comunicación.

Ejemplos:

- WhatsApp
- Telegram
- Web Chat
- Facebook Messenger

Eventos:

- CanalConectado
- CanalDesconectado

---

## Conocimiento

Responsabilidad:

Gestionar la base de conocimiento utilizada por la IA.

Incluye:

- Documentos
- FAQs
- Archivos
- Versiones

Eventos:

- DocumentoAgregado
- DocumentoActualizado

---

## Suscripción

Responsabilidad:

Administrar los planes contratados.

Incluye:

- Planes
- Renovaciones
- Límites
- Estado

Eventos:

- PlanContratado
- PlanRenovado

---

## Facturación

Responsabilidad:

Gestionar cobros y pagos.

Incluye:

- Facturas
- Pagos
- Historial

Eventos:

- FacturaGenerada
- PagoConfirmado

---

## Notificaciones

Responsabilidad:

Enviar notificaciones internas y externas.

Ejemplos:

- Email
- WhatsApp
- SMS
- Push

Eventos:

- NotificacionEnviada

---

## Automatización

Responsabilidad:

Ejecutar procesos automáticos.

Ejemplos:

- Recordatorios
- Mensajes programados
- Reglas automáticas

Eventos:

- AutomatizacionEjecutada

---

## Auditoría

Responsabilidad:

Registrar todas las acciones relevantes del sistema.

Incluye:

- Historial
- Cambios
- Acciones críticas
- Seguridad

Eventos:

- AuditoriaRegistrada

---

# Comunicación entre Contextos

La comunicación se realizará únicamente mediante:

- Casos de uso públicos.
- Eventos de dominio.

Nunca mediante acceso directo a entidades o repositorios de otro contexto.

Ejemplo:

Empresa publica el evento:

EmpresaCreada

↓

Suscripción crea un plan inicial

↓

Notificaciones envía un mensaje de bienvenida

↓

Auditoría registra la operación

Cada contexto decide de forma independiente cómo reaccionar.

---

# Independencia

Cada Bounded Context podrá evolucionar sin modificar los demás.

Esto permitirá:

- Agregar nuevas funcionalidades.
- Reemplazar implementaciones.
- Extraer un contexto como microservicio en el futuro.

Todo ello sin afectar el resto del sistema.

---

# Beneficios

La utilización de Bounded Contexts proporciona:

- Bajo acoplamiento.
- Alta cohesión.
- Mayor claridad del dominio.
- Mejor organización del código.
- Escalabilidad funcional.
- Escalabilidad organizacional.

---

# Conclusión

Los Bounded Contexts representan la división estratégica del dominio de Abiel Core.

Cada contexto encapsula una parte específica del negocio y se comunica con los demás mediante contratos bien definidos, permitiendo construir un sistema robusto, mantenible y preparado para crecer.