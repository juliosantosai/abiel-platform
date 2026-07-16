# 03 - Entidades y Value Objects del Módulo Empresa

# Objetivo

Este documento define los objetos principales que pertenecen al dominio del módulo Empresa.

Antes de escribir código debemos identificar correctamente:

- Qué conceptos del negocio tienen identidad.
- Qué conceptos son valores.
- Qué comportamiento pertenece a cada objeto.
- Qué reglas debe proteger cada uno.

El objetivo es evitar crear clases que solamente sean contenedores de datos.

---

# Modelo de Dominio

El módulo Empresa tiene como concepto principal:

```
Empresa
```

La Empresa será la entidad raíz del módulo.

Modelo:

```
                Empresa

                   |
                   |
        -----------------------

        Identidad

        Estado

        Información comercial

        Configuración
```

---

# Entidades del Módulo

Una entidad es un objeto que posee:

- Identidad única.
- Ciclo de vida.
- Comportamiento.
- Reglas propias.

Dentro del módulo Empresa tendremos:

```
domain/

└── entities/

    └── Empresa
```

---

# Entidad Empresa

## Definición

Empresa representa un cliente dentro de Abiel Core.

No representa solamente una fila de base de datos.

Representa un objeto del negocio.

---

# Responsabilidades de Empresa

La entidad Empresa será responsable de:

- Mantener su identidad.
- Mantener su estado actual.
- Validar cambios permitidos.
- Cambiar su información básica.
- Generar eventos de dominio.

---

# Información de Empresa

La entidad tendrá información como:

```
Empresa

- id
- nombre
- estado
- fechaCreacion
- fechaActualizacion
```

---

# Identidad

Toda Empresa tendrá:

```
id
```

Características:

- Único.
- Permanente.
- No cambia durante la vida de la entidad.

Ejemplo:

```
Empresa A

id:
550e8400-e29b
```

Aunque cambie el nombre, sigue siendo la misma Empresa.

---

# Estado

La Empresa tendrá un ciclo de vida.

Estados definidos:

```
PENDIENTE

ACTIVA

SUSPENDIDA

CANCELADA
```

La entidad será responsable de controlar estos cambios.

---

# Comportamiento de Empresa

La entidad tendrá métodos de negocio.

Ejemplos:

```
activar()

suspender()

cancelar()

actualizarNombre()
```

---

# Regla importante

Los cambios no deben hacerse directamente.

Incorrecto:

```javascript
empresa.estado = "ACTIVA";
```

Correcto:

```javascript
empresa.activar();
```

La entidad protege sus reglas.

---

# Value Objects

## Definición

Un Value Object representa un concepto del negocio que:

- No tiene identidad propia.
- Se define por su valor.
- Debe ser válido siempre.

---

# Value Objects futuros del módulo

Inicialmente:

```
valueObjects/

├── NombreEmpresa

├── Ruc

└── EmailEmpresa
```

---

# NombreEmpresa

## Concepto

Representa el nombre comercial de una empresa.

Ejemplo:

```
Barbería Santos
```

---

# Responsabilidades

Debe validar:

- Que exista valor.
- Que tenga longitud correcta.
- Que no contenga solamente espacios.

---

# Por qué usar Value Object

Forma incorrecta:

```
nombre: string
```

Problema:

Cualquier texto puede entrar.

Ejemplo:

```
nombre = ""
```

---

Forma correcta:

```
NombreEmpresa
```

El objeto garantiza que siempre sea válido.

---

# RUC

## Concepto

Representa la identificación fiscal de la empresa.

Ejemplo:

```
80012345-6
```

---

# Responsabilidad

Validar formato.

No debe conocer:

- Facturación.
- Impuestos.
- Pagos.

Solo representa un RUC válido.

---

# EmailEmpresa

## Concepto

Representa un correo empresarial.

Ejemplo:

```
contacto@empresa.com
```

---

# Responsabilidad

Garantizar:

- Formato correcto.
- Valor válido.

---

# Relación entre Entidad y Value Objects

Modelo:

```
             Empresa


               |

      -------------------

      NombreEmpresa

      Ruc

      EmailEmpresa
```

La entidad utiliza Value Objects.

---

# Encapsulamiento

La entidad debe proteger su estado interno.

Ejemplo:

Incorrecto:

```
empresa.nombre = "Nuevo nombre"
```

Correcto:

```
empresa.actualizarNombre()
```

---

# Inmutabilidad

Los Value Objects deben ser inmutables.

Ejemplo:

Incorrecto:

```
nombre.valor = "otro"
```

Correcto:

Crear un nuevo objeto:

```
nuevo NombreEmpresa()
```

---

# POO Aplicada

## Encapsulamiento

El objeto controla sus datos.

---

## Abstracción

Representamos conceptos reales del negocio.

Ejemplo:

```
NombreEmpresa
```

es más expresivo que:

```
string
```

---

## Responsabilidad

Cada objeto conoce solamente su propio comportamiento.

---

# DDD Aplicado

Conceptos utilizados:

## Entity

Objeto con identidad:

```
Empresa
```

---

## Value Object

Objeto definido por valor:

```
NombreEmpresa
```

---

## Aggregate Root

Empresa será la raíz del agregado.

---

# Aggregate Empresa

Un agregado protege sus reglas internas.

Modelo:

```
             Empresa

                |

       -----------------

       Nombre

       Estado

       Configuración
```

Los objetos internos no pueden modificarse desde afuera sin pasar por Empresa.

---

# Eventos derivados

Cuando la entidad cambia puede generar:

```
EmpresaCreada

EmpresaActivada

EmpresaSuspendida

EmpresaCancelada
```

---

# Errores que evitamos

Sin este diseño:

- Entidades anémicas.
- Objetos con demasiadas responsabilidades.
- Datos inválidos.
- Reglas duplicadas.
- Dependencia fuerte de infraestructura.

---

# Resumen

El dominio Empresa estará formado por:

## Entidad

```
Empresa
```

Responsable de:

- Identidad.
- Estado.
- Reglas.

---

## Value Objects

```
NombreEmpresa

Ruc

EmailEmpresa
```

Responsables de:

- Validación.
- Representación de conceptos.

---

# Conclusión

El modelo de dominio del módulo Empresa será construido alrededor de objetos que representan el negocio real.

Primero definimos conceptos y responsabilidades.

Después construiremos las clases JavaScript.