# 08 - Convenciones de Nombres

# Objetivo

Este documento define las reglas oficiales para nombrar archivos, carpetas, clases, métodos, variables, eventos y componentes dentro de Abiel Core.

El objetivo es mantener una identidad técnica uniforme en todo el proyecto y facilitar la lectura, mantenimiento y evolución del sistema.

Estas reglas son obligatorias para todos los módulos.

---

# Principios Generales

Los nombres deben cumplir:

- Ser descriptivos.
- Representar una única responsabilidad.
- Utilizar el lenguaje del dominio.
- Evitar abreviaciones innecesarias.
- Evitar nombres genéricos.
- Mantener consistencia en todo el proyecto.

---

# Lenguaje del Dominio

Los nombres deben utilizar el lenguaje utilizado por el negocio.

Ejemplo:

Correcto:

```
Empresa
Conversacion
Suscripcion
Mensaje
```

Incorrecto:

```
ClientData
UserManager
DataHandler
```

El código debe reflejar el negocio, no detalles técnicos.

---

# Convenciones de Carpetas

Las carpetas utilizarán:

## kebab-case o lowercase

Ejemplos:

Correcto:

```
empresa
usuario
facturacion
event-handlers
```

Incorrecto:

```
Empresa
UserModule
FACTURACION
```

---

# Convenciones de Archivos

Los archivos que representan clases utilizarán:

PascalCase

Ejemplos:

```
Empresa.js
CrearEmpresa.js
PrismaEmpresaRepository.js
```

---

Los archivos de configuración utilizarán:

lowercase

Ejemplos:

```
database.js
logger.js
config.js
```

---

# Clases

Las clases utilizarán PascalCase.

Ejemplos:

```javascript
Empresa

Usuario

CrearEmpresa

EventBus
```

Una clase debe representar una responsabilidad clara.

---

# Entidades de Dominio

Las entidades utilizarán nombres del negocio.

Ejemplos:

```
Empresa.js

Usuario.js

Conversacion.js
```

No utilizar nombres técnicos:

Incorrecto:

```
EmpresaModel.js
EmpresaEntityData.js
```

---

# Value Objects

Los Value Objects utilizarán nombres que representen conceptos del dominio.

Ejemplos:

```
Email.js

Plan.js

Telefono.js

NombreEmpresa.js
```

---

# Casos de Uso

Los casos de uso utilizarán verbo + objeto.

Formato:

```
AccionEntidad
```

Ejemplos:

```
CrearEmpresa

ActualizarUsuario

ActivarSuscripcion

EnviarMensaje
```

No utilizar:

```
EmpresaService
ManagerEmpresa
EmpresaHandler
```

---

# Métodos

Los métodos utilizarán camelCase.

Ejemplos:

```javascript
crear()

activar()

actualizarNombre()

cambiarPlan()
```

Los métodos deben representar acciones.

---

# Variables

Utilizar camelCase.

Ejemplos:

Correcto:

```javascript
empresaId

nombreEmpresa

fechaCreacion
```

Incorrecto:

```javascript
EmpresaID

nombre_empresa

FECHA
```

---

# Constantes

Utilizar:

UPPER_SNAKE_CASE

Ejemplos:

```javascript
MAX_INTENTOS_LOGIN

DEFAULT_PLAN
```

---

# Interfaces de Repositorio

Los contratos de repositorio tendrán:

Entidad + Repository

Ejemplos:

```
EmpresaRepository

UsuarioRepository

MensajeRepository
```

---

# Implementaciones de Repositorio

Las implementaciones indicarán la tecnología utilizada.

Formato:

Tecnologia + Entidad + Repository

Ejemplos:

```
PrismaEmpresaRepository

MongoEmpresaRepository

PostgresUsuarioRepository
```

---

# Eventos de Dominio

Los eventos siempre estarán escritos en pasado.

Formato:

Entidad + AcciónTerminada

Ejemplos:

```
EmpresaCreada

UsuarioRegistrado

PagoConfirmado

MensajeRecibido
```

Incorrectos:

```
CrearEmpresa

EnviarMensaje
```

---

# Handlers de Eventos

Los consumidores de eventos utilizarán:

Evento + Handler

Ejemplos:

```
EmpresaCreadaHandler

PagoConfirmadoHandler
```

---

# Servicios de Dominio

Utilizarán nombres relacionados con la acción del dominio.

Ejemplos:

```
CalculadorDePrecio

ValidadorDePlan

GeneradorDeConfiguracion
```

---

# Controladores

Utilizarán:

Entidad + Controller

Ejemplos:

```
EmpresaController

UsuarioController
```

---

# DTOs

Utilizarán:

Acción + Entidad + DTO

Ejemplos:

```
CrearEmpresaDTO

ActualizarUsuarioDTO
```

---

# Pruebas

Los archivos de prueba utilizarán:

Nombre + .test.js

Ejemplos:

```
Empresa.test.js

CrearEmpresa.test.js

EmpresaRepository.test.js
```

---

# Reglas de nombres prohibidos

Evitar:

```
Utils.js

Helper.js

Manager.js

Common.js

Data.js

Handler.js
```

cuando no expresen una responsabilidad específica.

Ejemplo:

Incorrecto:

```
UserManager.js
```

Correcto:

```
ActualizarUsuario.js
```

---

# Nombres de módulos

Los módulos utilizarán nombres del dominio.

Ejemplos:

```
empresa

usuario

conversacion

facturacion
```

No utilizar nombres técnicos:

Incorrecto:

```
module1

services

databaseLayer
```

---

# Beneficios

Estas convenciones permiten:

- Lectura rápida del código.
- Menos errores.
- Mayor productividad.
- Mejor colaboración entre desarrolladores.
- Arquitectura más fácil de mantener.

---

# Conclusión

Las convenciones de nombres forman parte de la arquitectura de Abiel Core.

Un buen nombre comunica intención, reduce complejidad y permite que el código sea comprendido incluso por personas que no participaron en su creación.

Todo nuevo componente deberá seguir estas reglas antes de ser incorporado al proyecto.