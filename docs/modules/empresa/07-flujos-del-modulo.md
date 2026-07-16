# 07 - Flujos del Módulo Empresa

# Objetivo

Este documento describe los flujos principales del módulo Empresa.

El objetivo es visualizar cómo interactúan:

- Interfaces.
- Casos de uso.
- Dominio.
- Repositorios.
- Eventos.
- Otros módulos.

Estos flujos representan comportamiento del sistema, no implementación técnica.

---

# Principio General de Flujo

Toda operación seguirá la dirección:

```
Entrada externa

↓

Application

↓

Domain

↓

Repository

↓

Persistencia

↓

Evento

↓

Otros módulos
```

---

# Flujo 1 - Crear Empresa

## Objetivo

Registrar una nueva empresa dentro de Abiel Core.

---

# Actor

Puede ser:

- Usuario administrador.
- Sistema externo autorizado.
- Panel administrativo.

---

# Flujo completo

```
Usuario

↓

Crear solicitud

↓

Controller

↓

CrearEmpresa Use Case

↓

Crear Entidad Empresa

↓

Validar reglas del dominio

↓

Guardar mediante Repository

↓

Persistir Empresa

↓

Generar EmpresaCreada

↓

Publicar EventBus
```

---

# Detalle del flujo

## Paso 1

La capa externa recibe la solicitud.

Ejemplo:

```
Crear empresa:
"Barbería Santos"
```

---

## Paso 2

El caso de uso recibe los datos.

Responsabilidad:

- Coordinar.
- No validar reglas internas.

---

## Paso 3

Se crea la entidad:

```
Empresa
```

La entidad valida:

- Nombre.
- Estado inicial.
- Datos obligatorios.

---

## Paso 4

El repositorio guarda la entidad.

El dominio no sabe:

- PostgreSQL.
- Prisma.

---

## Paso 5

Se genera:

```
EmpresaCreada
```

---

# Resultado

La empresa existe dentro del sistema.

---

# Flujo 2 - Actualizar Empresa

## Objetivo

Modificar información permitida.

Ejemplo:

Cambiar nombre comercial.

---

# Flujo

```
Solicitud

↓

ActualizarEmpresa

↓

Buscar Empresa

↓

Ejecutar método del dominio

↓

Guardar cambios

↓

EmpresaActualizada

```

---

# Regla importante

Nunca modificar datos directamente.

Incorrecto:

```
empresa.nombre = nuevoNombre
```

Correcto:

```
empresa.actualizarNombre()
```

---

# Flujo 3 - Activar Empresa

## Objetivo

Cambiar empresa al estado activa.

---

# Estado inicial

```
PENDIENTE
```

---

# Acción

```
activar()
```

---

# Resultado

```
ACTIVA
```

---

# Flujo

```
ActivarEmpresa

↓

Buscar Empresa

↓

Empresa.activar()

↓

Guardar

↓

EmpresaActivada

```

---

# Validación

La entidad verifica si la transición es válida.

Ejemplo:

Permitido:

```
PENDIENTE → ACTIVA
```

No permitido:

```
CANCELADA → ACTIVA
```

---

# Flujo 4 - Suspender Empresa

## Objetivo

Bloquear temporalmente una empresa.

---

# Ejemplos

- Falta de pago.
- Revisión administrativa.

---

# Flujo

```
SuspenderEmpresa

↓

Buscar Empresa

↓

Empresa.suspender()

↓

Guardar

↓

EmpresaSuspendida
```

---

# Efectos posteriores

Otros módulos pueden reaccionar:

```
EmpresaSuspendida

↓

Conversaciones

↓

Desactivar automatizaciones
```

---

# Flujo 5 - Cancelar Empresa

## Objetivo

Finalizar la cuenta.

---

# Regla

No eliminar datos.

Se realiza baja lógica.

---

# Flujo

```
CancelarEmpresa

↓

Empresa.cancelar()

↓

Estado CANCELADA

↓

Guardar

↓

EmpresaCancelada
```

---

# Flujo de Eventos

Cuando ocurre un cambio:

```
Entidad Empresa

↓

Evento Dominio

↓

EventBus

↓

Handlers

↓

Otros módulos
```

---

# Ejemplo:

Empresa creada:

```
EmpresaCreada

        |

        |

        +---- Usuario Handler

        |

        +---- Notificación Handler

        |

        +---- Auditoría Handler
```

---

# Flujo entre capas

## Interface

Responsable:

- Recibir información.
- Entregar respuesta.

---

## Application

Responsable:

- Coordinar operación.

---

## Domain

Responsable:

- Aplicar reglas.

---

## Infrastructure

Responsable:

- Guardar información.

---

# Diagrama general

```
                Cliente


                  |

                  ▼


              Interface


                  |

                  ▼


             Use Case


                  |

                  ▼


              Empresa


                  |

                  ▼


          EmpresaRepository


                  |

                  ▼


             PostgreSQL


                  |

                  ▼


             EventBus


                  |

                  ▼


          Otros módulos
```

---

# Comunicación con otros módulos

El módulo Empresa nunca realiza llamadas directas.

Incorrecto:

```
Empresa

↓

Enviar WhatsApp
```

---

Correcto:

```
Empresa

↓

EmpresaCreada

↓

WhatsApp Module
```

---

# Manejo de errores

Los errores pueden aparecer en:

## Dominio

Ejemplo:

```
EmpresaNoPuedeActivarseError
```

---

## Aplicación

Ejemplo:

```
EmpresaNoEncontradaError
```

---

## Infraestructura

Ejemplo:

```
DatabaseConnectionError
```

---

# Pruebas de flujo

Cada flujo tendrá pruebas:

## Crear Empresa

Verificar:

- Entidad creada.
- Repositorio llamado.
- Evento generado.

---

## Activar Empresa

Verificar:

- Cambio correcto.
- Regla respetada.
- Evento publicado.

---

# Resumen

Los principales flujos del módulo Empresa son:

```
Crear

Actualizar

Activar

Suspender

Cancelar
```

Todos siguen la misma arquitectura:

```
Application

↓

Domain

↓

Infrastructure

↓

Events
```

---

# Conclusión

Los flujos del módulo Empresa mantienen separación de responsabilidades y permiten que Abiel Core crezca sin acoplar módulos entre sí.