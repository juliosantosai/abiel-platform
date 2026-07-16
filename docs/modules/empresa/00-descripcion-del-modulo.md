# Módulo Empresa

## Objetivo

El módulo Empresa representa el núcleo de identidad empresarial dentro de Abiel Core.

Una empresa es el elemento principal del modelo SaaS.

Cada cliente que utiliza Abiel Core representa una Empresa independiente.

El módulo Empresa será responsable de:

- Crear empresas.
- Administrar información básica.
- Controlar estado de la empresa.
- Mantener identidad del cliente.
- Emitir eventos cuando ocurren cambios importantes.

---

# Contexto del Negocio

Abiel Core es una plataforma SaaS multiempresa.

Cada negocio que utiliza la plataforma tendrá una Empresa.

Ejemplos:

- Barbería.
- Restaurante.
- Clínica.
- Tienda.
- Profesional independiente.

Cada empresa tendrá sus propios:

- Usuarios.
- Conversaciones.
- Mensajes.
- Configuraciones.
- Conocimiento.
- Automatizaciones.

---

# Responsabilidad del Módulo

El módulo Empresa responde principalmente:

"¿Quién es el cliente dentro de Abiel Core?"

---

# Responsabilidades Permitidas

El módulo puede:

- Crear una empresa.
- Cambiar datos básicos.
- Activar o desactivar empresa.
- Validar reglas propias.
- Generar eventos de dominio.

---

# Responsabilidades NO Permitidas

El módulo NO debe:

- Administrar usuarios.
- Gestionar pagos.
- Enviar mensajes.
- Administrar IA.
- Crear conversaciones.
- Gestionar WhatsApp.

Esas responsabilidades pertenecen a otros módulos.

---

# Bounded Context

El módulo Empresa representa el siguiente contexto:


Empresa Context

Responsabilidad:

Identidad y ciclo de vida del cliente SaaS


---

# Relación con otros módulos

La empresa será utilizada por:


Empresa

├── Usuario
│
├── Suscripción
│
├── Conversación
│
├── Mensaje
│
├── IA
│
├── Facturación
│
└── Auditoría


---

# Regla Principal

Otros módulos no pueden modificar directamente una Empresa.

Ejemplo incorrecto:


Facturación

↓

Modificar Empresa directamente


Correcto:


Facturación

↓

Enviar comando o evento

↓

Empresa actualiza su estado


---

# Modelo Mental

Una Empresa no es solamente una tabla.

Es una entidad del negocio con:

- Identidad.
- Reglas.
- Estados.
- Comportamiento.

Ejemplo:

Incorrecto:


Empresa = datos almacenados


Correcto:


Empresa = objeto con identidad y comportamiento


---

# Arquitectura Interna

El módulo seguirá Arquitectura Hexagonal:

            Empresa Module


         Application Layer

                |

                |

          Domain Layer

                |

                |

      Infrastructure Layer

---

# Estructura del Código


src/modules/empresa/

├── domain/

│ ├── entities/

│ ├── valueObjects/

│ ├── events/

│ ├── repositories/

│ └── errors/

├── application/

│ ├── useCases/

│ └── dto/

├── infrastructure/

│ └── persistence/

├── interfaces/

└── tests/


---

# Principios Aplicados

## DDD

La Empresa es una Entidad de Dominio.

Tiene:

- Identidad propia.
- Ciclo de vida.
- Reglas de negocio.

---

## POO

Utiliza:

- Encapsulamiento.
- Objetos con comportamiento.
- Protección del estado interno.

---

## SOLID

Principalmente:

### Single Responsibility Principle

Empresa solamente administra su propio negocio.

---

### Dependency Inversion Principle

El dominio define contratos.

La infraestructura implementa.

---

# Eventos del Módulo

El módulo podrá generar eventos como:


EmpresaCreada

EmpresaActualizada

EmpresaActivada

EmpresaSuspendida


Estos eventos serán consumidos por otros módulos.

---

# Persistencia

El módulo no conocerá directamente:

- PostgreSQL.
- Prisma.
- SQL.

La persistencia será responsabilidad de:


infrastructure/


mediante un repositorio.

---

# Seguridad Multi-Tenant

La Empresa será la raíz del aislamiento de datos.

Todo dato relacionado deberá contener:


empresaId


Ejemplo:


Mensaje

id
empresaId
contenido
fecha


---

# Escalabilidad

El diseño permitirá:

Actualmente:


Una aplicación

Muchas empresas


Futuro:


Servicio Empresa independiente


sin cambiar el dominio.

---

# Conclusión

El módulo Empresa es la base del modelo SaaS de Abiel Core.

Su responsabilidad es representar la identidad y ciclo de vida de cada cliente empresarial.

Debe mantenerse pequeño, estable y enfocado únicamente en el negocio de la empresa.