# 09 - Pruebas del Módulo Empresa

# Objetivo

Este documento define la estrategia de pruebas del módulo Empresa dentro de Abiel Core.

El objetivo es garantizar que:

- Las reglas del negocio funcionen correctamente.
- Los casos de uso cumplan su responsabilidad.
- Las integraciones funcionen.
- Los cambios futuros no rompan funcionalidades existentes.

Las pruebas deben validar comportamiento, no implementación interna.

---

# Principio General

Las pruebas deben seguir la misma separación de la arquitectura.

Modelo:

```
                 Tests


                    |

        ---------------------------

        |            |            |

     Domain    Application   Infrastructure

```

---

# Tipos de Pruebas

El módulo Empresa tendrá:

```
Unit Tests

Integration Tests

End-to-End Tests
```

---

# 1. Pruebas Unitarias de Dominio

## Objetivo

Validar las reglas puras del negocio.

No utilizan:

- Base de datos.
- Prisma.
- APIs.
- Frameworks.

---

# Ubicación

```
tests/

└── unit/

    └── domain/
```

---

# Qué se prueba

Principalmente:

```
Empresa Entity

Value Objects

Domain Events
```

---

# Ejemplo de comportamiento a probar

## Creación de Empresa

Debe comprobar:

- Tiene ID.
- Tiene nombre válido.
- Inicia con estado correcto.

---

Ejemplo:

```
Crear Empresa

↓

Estado esperado:

PENDIENTE
```

---

# Cambio de estado

Debe validar:

Permitido:

```
PENDIENTE

↓

ACTIVA
```

---

No permitido:

```
CANCELADA

↓

ACTIVA
```

---

# Prueba de reglas

Ejemplo:

Nombre vacío:

```
NombreEmpresa("")
```

Debe producir:

```
NombreEmpresaInvalidoError
```

---

# 2. Pruebas de Value Objects

## Objetivo

Garantizar que los valores del dominio siempre sean válidos.

---

# NombreEmpresa

Casos:

Debe aceptar:

```
Barbería Santos
```

Debe rechazar:

```
""
```

---

# RUC

Debe validar:

- Formato.
- Longitud.
- Datos permitidos.

---

# EmailEmpresa

Debe validar:

Correcto:

```
contacto@empresa.com
```

Incorrecto:

```
correo-invalido
```

---

# 3. Pruebas de Casos de Uso

## Objetivo

Validar la coordinación de la aplicación.

---

# Ubicación

```
tests/

└── unit/

    └── application/
```

---

# Caso: CrearEmpresa

Debe verificar:

- Crea entidad.
- Usa repositorio.
- Publica evento.

---

Flujo esperado:

```
CrearEmpresa

↓

EmpresaRepository.guardar()

↓

EventBus.publish()
```

---

# Caso: ActivarEmpresa

Debe verificar:

- Busca empresa.
- Ejecuta método del dominio.
- Guarda cambios.
- Publica evento.

---

# 4. Fake Repositories

Para pruebas no usamos PostgreSQL.

Usamos:

```
FakeEmpresaRepository
```

---

# Objetivo

Simular persistencia.

Ejemplo:

```
Memoria RAM

[]

Empresa A

Empresa B
```

---

# Beneficio

Las pruebas son:

- Rápidas.
- Independientes.
- Fáciles de ejecutar.

---

# 5. Pruebas de Eventos

## Objetivo

Validar que los eventos sean creados correctamente.

---

# Eventos a probar:

```
EmpresaCreada

EmpresaActualizada

EmpresaActivada

EmpresaSuspendida

EmpresaCancelada
```

---

# Validaciones:

- Nombre correcto.
- EmpresaId correcto.
- Fecha correcta.
- Datos inmutables.

---

# 6. Pruebas de Infraestructura

## Objetivo

Validar implementaciones reales.

Ejemplo:

```
PrismaEmpresaRepository
```

---

# Ubicación

```
tests/

└── integration/

    └── infrastructure/
```

---

# Se prueba:

- Guardar en PostgreSQL.
- Buscar por ID.
- Recuperar entidad correctamente.

---

# 7. Pruebas de Integración

## Objetivo

Validar comunicación entre capas.

Ejemplo:

```
CrearEmpresa

↓

Repository

↓

Database

↓

EventBus
```

---

# Componentes involucrados:

- Application.
- Domain.
- Infrastructure.

---

# 8. Pruebas End-to-End

## Objetivo

Validar comportamiento desde el exterior.

Ejemplo:

```
HTTP Request

↓

Crear Empresa

↓

Respuesta correcta
```

---

# Ubicación

```
tests/

└── e2e/
```

---

# Estructura final de pruebas

```
empresa/

└── tests/

    ├── unit/

    │   ├── domain/

    │   │   ├── Empresa.test.js
    │   │   ├── NombreEmpresa.test.js
    │   │   └── events.test.js
    │   │
    │   └── application/

    │       ├── CrearEmpresa.test.js
    │       └── ActivarEmpresa.test.js
    │
    ├── integration/

    │   └── PrismaEmpresaRepository.test.js
    │
    └── e2e/

        └── empresa-flow.test.js
```

---

# Reglas para escribir pruebas

## Una prueba debe probar comportamiento

Incorrecto:

```
Debe llamar método X interno
```

Correcto:

```
Empresa debe quedar activa
```

---

# Nombre de pruebas

Debe describir comportamiento.

Ejemplo:

Correcto:

```
debe activar una empresa pendiente
```

Incorrecto:

```
test activar()
```

---

# Cobertura esperada

No buscamos 100% de líneas.

Buscamos cubrir:

- Reglas importantes.
- Casos críticos.
- Comportamientos del negocio.

---

# Pruebas y evolución

Cuando agreguemos nuevas reglas:

Primero:

1. Crear prueba.
2. Implementar cambio.
3. Verificar que todo siga funcionando.

---

# Errores que evitamos

Sin pruebas:

- Cambios rompen funcionalidades.
- Reglas duplicadas.
- Errores en producción.
- Miedo a evolucionar.

---

# Resumen

El módulo Empresa tendrá pruebas en tres niveles:

```
Unitarias

↓

Integración

↓

End-to-End
```

Cada nivel valida una parte diferente del sistema.

---

# Conclusión

Las pruebas garantizan que el módulo Empresa pueda evolucionar durante años manteniendo estabilidad y confianza.

Un módulo profesional no solamente tiene código funcionando.

Tiene reglas verificadas automáticamente.