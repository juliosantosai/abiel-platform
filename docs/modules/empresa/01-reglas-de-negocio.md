# 01 - Reglas de Negocio del Módulo Empresa

# Objetivo

Este documento define todas las reglas de negocio que gobiernan la entidad Empresa dentro de Abiel Core.

Estas reglas representan conocimiento del negocio y deben existir independientemente de:

- Base de datos.
- Frameworks.
- APIs.
- Interfaces.
- Infraestructura.

El dominio será el encargado de proteger estas reglas.

---

# Concepto de Empresa

Dentro de Abiel Core, una Empresa representa un cliente SaaS.

Una Empresa posee:

- Identidad propia.
- Información comercial.
- Estado dentro de la plataforma.
- Configuración inicial.
- Ciclo de vida.

Una Empresa no es solamente información almacenada.

Es una entidad con comportamiento.

---

# Identidad de la Empresa

Toda Empresa debe tener un identificador único.

Regla:

```
Toda Empresa debe tener un ID único dentro del sistema.
```

Ejemplo:

```
Empresa

id:
550e8400-e29b-41d4-a716-446655440000
```

El identificador será generado mediante UUID.

---

# Creación de una Empresa

Una Empresa puede ser creada cuando:

- Un nuevo cliente se registra.
- Un administrador crea una cuenta.
- Un proceso externo autorizado solicita creación.

Al crear una Empresa deben existir datos mínimos.

Requeridos:

- Nombre.
- Identificador único.

---

# Datos obligatorios iniciales

Una Empresa debe tener:

## Nombre

Representa la identidad comercial.

Reglas:

- No puede estar vacío.
- Debe tener longitud válida.
- No debe contener solamente espacios.

---

## Estado

Toda Empresa debe iniciar con un estado definido.

Estado inicial:

```
PENDIENTE
```

Ejemplo:

```
Empresa creada

Estado:
PENDIENTE
```

---

# Ciclo de Vida de una Empresa

La Empresa tendrá estados controlados.

Estados permitidos:

```
PENDIENTE

ACTIVA

SUSPENDIDA

CANCELADA
```

---

# Transiciones permitidas

## PENDIENTE → ACTIVA

Permitido.

Ejemplo:

Cliente completa configuración inicial.

---

## ACTIVA → SUSPENDIDA

Permitido.

Ejemplo:

Problemas de pago o suspensión administrativa.

---

## SUSPENDIDA → ACTIVA

Permitido.

Ejemplo:

Cliente regulariza situación.

---

## ACTIVA → CANCELADA

Permitido.

Ejemplo:

Cliente elimina servicio.

---

# Transiciones prohibidas

No permitido:

```
CANCELADA → ACTIVA
```

Una empresa cancelada no vuelve al ciclo normal.

---

# Regla de Estado

Una Empresa nunca puede cambiar de estado sin pasar por un método del dominio.

Incorrecto:

```javascript
empresa.estado = "ACTIVA";
```

Correcto:

```javascript
empresa.activar();
```

El dominio protege las reglas.

---

# Actualización de Información

Una Empresa puede actualizar información básica.

Ejemplo:

- Nombre comercial.
- Datos de contacto.

Pero cada cambio debe validar reglas.

---

# Regla de Nombre

Al cambiar el nombre:

Debe:

- Tener valor válido.
- Mantener consistencia.

Ejemplo:

Permitido:

```
Barbería Santos
```

No permitido:

```
""
```

---

# Eliminación de Empresa

Una Empresa no será eliminada físicamente inicialmente.

Se utilizará eliminación lógica.

Ejemplo:

```
estado = CANCELADA
```

Motivo:

- Mantener historial.
- Mantener auditoría.
- Evitar pérdida de información.

---

# Multi-Tenant

La Empresa será la raíz del aislamiento de datos.

Todo recurso perteneciente a una empresa debe relacionarse mediante:

```
empresaId
```

Ejemplo:

```
Empresa

     |
     |
     +---- Usuarios

     |
     |
     +---- Conversaciones

     |
     |
     +---- Mensajes
```

---

# Reglas de Independencia

Una Empresa no debe conocer:

- Usuarios.
- Mensajes.
- IA.
- Facturación.

Ejemplo incorrecto:

```
Empresa.activarUsuario()
```

Porque pertenece al módulo Usuario.

---

# Eventos de Dominio

Cuando ocurre un cambio importante, la Empresa debe emitir eventos.

Ejemplos:

## EmpresaCreada

Se genera cuando:

- La empresa fue creada correctamente.

---

## EmpresaActivada

Se genera cuando:

- Cambia de PENDIENTE a ACTIVA.

---

## EmpresaSuspendida

Se genera cuando:

- Cambia a estado suspendido.

---

# Reglas de Eventos

Los eventos:

- Son inmutables.
- Representan hechos ocurridos.
- No contienen lógica.
- No modifican el dominio.

---

# Validaciones del Dominio

Las validaciones importantes deben estar dentro del dominio.

Ejemplo:

Correcto:

```
Empresa.validarNombre()
```

Incorrecto:

```
Controller.validarEmpresa()
```

El controlador solo recibe información.

---

# Responsabilidad del Caso de Uso

El caso de uso:

```
CrearEmpresa
```

debe:

1. Recibir información.
2. Crear la entidad.
3. Guardarla mediante repositorio.
4. Publicar eventos.

Pero no debe decidir las reglas internas.

---

# Reglas futuras

El módulo podrá evolucionar agregando:

- Plan asociado.
- Configuración inicial.
- Límites de uso.
- Nivel de servicio.

Sin romper las reglas actuales.

---

# Resumen

Las reglas principales de Empresa son:

- Tiene identidad única.
- Controla su propio estado.
- Protege sus cambios.
- Genera eventos.
- No conoce otros módulos.
- Es la raíz del aislamiento multi-tenant.
- Mantiene la lógica del negocio dentro del dominio.

---

# Conclusión

La entidad Empresa será una pieza central de Abiel Core.

Su diseño debe ser estable porque muchos módulos dependerán de ella.

Por esta razón, primero definimos sus reglas antes de crear código.