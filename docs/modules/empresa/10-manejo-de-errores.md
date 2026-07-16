# 10 - Manejo de Errores del Módulo Empresa

## Introducción

El módulo Empresa utiliza errores específicos de dominio para mantener claridad en la semántica de los fallos y facilitar el manejo en capas superiores.

### Errores compartidos utilizados

- `DomainError` - para violaciones de reglas de negocio del dominio.
- `ValidationError` - para errores de validación y reglas del dominio.
- `NotFoundError` - para casos donde no existe la entidad solicitada.

Estas clases se encuentran en `src/shared/errors` y se reutilizan desde el módulo Empresa.

## Por qué usar errores específicos

Usar errores específicos en lugar de `Error` genérico permite:

- distinguir claramente el tipo de falla
- reaccionar de forma adecuada en la capa de aplicación o en el API
- mantener el dominio limpio y predecible
- evitar condicionales imprecisos basados en mensajes de texto

## Diferencias entre los errores

- `ValidationError`
  - Representa validaciones del dominio.
  - Se usa cuando los datos son inválidos o faltan campos obligatorios.
  - Ejemplo: `NombreEmpresa` lanza `ValidationError` si el nombre es vacío o muy corto.

- `DomainError`
  - Representa violaciones de reglas de negocio.
  - Se usa cuando una operación no está permitida por el modelo de dominio.
  - Ejemplo: intentar activar una empresa que ya está `CANCELADA`.

- `NotFoundError`
  - Representa la ausencia de una entidad esperada.
  - Se usa en la capa de aplicación cuando el repositorio no encuentra la empresa.
  - Ejemplo: buscar una empresa por ID inexistente.

## Responsabilidad por capa

### Domain

El dominio es responsable de mantener sus propias reglas de negocio y validaciones.

- `ValidationError` para las reglas de validación del dominio.
- `DomainError` para violaciones explicitas de las reglas de negocio.

Esto asegura que la lógica de negocio permanece dentro de la entidad `Empresa` y de los value objects.

### Application

La capa de aplicación coordina el flujo del caso de uso.

- `NotFoundError` se lanza cuando la entidad solicitada no existe.

La aplicación no debe validar reglas internas del dominio; simplemente debe orquestar la ejecución y propagar los errores adecuados.

### Infrastructure

La infraestructura debe ser un adaptador.

- No debe lanzar errores de dominio.
- Debe limitarse a errores de persistencia o adaptadores técnicos.

El repositorio de Prisma devuelve datos y los adapta al dominio, pero no debe decidir reglas de negocio.

## Flujo de un error

### Caso: Nombre de empresa inválido

```
NombreEmpresa
↓
ValidationError
↓
UseCase
↓
Capa superior
```

- El value object `NombreEmpresa` detecta el valor inválido.
- Lanza `ValidationError`.
- El caso de uso no valida de nuevo la regla, recibe el error y lo propaga.
- La capa superior puede traducirlo a una respuesta adecuada.

### Caso: Empresa inexistente

```
Repository
↓
NotFoundError
↓
UseCase
↓
Capa superior
```

- El repositorio intenta recuperar la empresa.
- Si no existe, la aplicación lanza `NotFoundError`.
- El caso de uso recibe el error y lo propaga.
- La capa superior decide cómo manejarlo.

## Reglas para futuros módulos

- No usar `throw new Error()` para reglas de negocio.
- Evitar errores genéricos para el dominio y la aplicación.
- Los errores compartidos deben vivir en `src/shared/errors`.
- Los errores específicos de un módulo deben definirse dentro del propio módulo cuando sean necesarios.
- El dominio debe usar errores de dominio, la aplicación debe usar errores de aplicación/recursos, y la infraestructura debe manejar errores técnicos.
