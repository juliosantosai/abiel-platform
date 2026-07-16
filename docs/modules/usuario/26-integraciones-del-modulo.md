Siguiente documento del módulo **Usuario**:

```text
docs/modules/usuario/26-integraciones-del-modulo.md
```

```md
# Integraciones del módulo Usuario

## 1. Objetivo

Definir cómo el módulo Usuario se comunica con otros módulos del sistema Abiel Core.

El módulo Usuario debe mantenerse desacoplado y comunicarse mediante:

- Casos de uso.
- Interfaces.
- Eventos de dominio.

No debe conocer detalles internos de otros módulos.

---

# 2. Principio de integración

Arquitectura:

```

```
             Eventos
```

Empresa  <----------------> Usuario

Usuario <----------------> Auth

Usuario <----------------> Notificaciones

Usuario <----------------> Auditoría

```

El módulo Usuario publica hechos.

Otros módulos reaccionan.

---

# 3. Integración con módulo Empresa

## Relación

Un Usuario pertenece a una Empresa.

Modelo:

```

Empresa
|
└── Usuario

```

---

## Dependencia

Usuario necesita:

- empresaId válido.
- Empresa existente.

---

## Crear usuario

Flujo:

```

Crear Usuario

```
  |
  ↓
```

Validar Empresa

```
  |
  ↓
```

Guardar Usuario

```
  |
  ↓
```

Publicar UsuarioCreado

```

---

## Evento consumido

Puede escuchar:

```

EmpresaCreada

```

Uso futuro:

Crear automáticamente:

- Usuario OWNER inicial.
- Configuración inicial.
- Invitaciones.

---

# 4. Integración con módulo Auth

## Objetivo

Separar:

Usuario:

- Identidad.
- Perfil.
- Rol.
- Empresa.

Auth:

- Login.
- Tokens.
- Sesiones.
- Seguridad.

---

Relación:

```

Usuario

|

Auth Account

```

---

## Flujo login

```

Usuario intenta ingresar

```
      ↓
```

Auth valida credenciales

```
      ↓
```

Busca Usuario

```
      ↓
```

Carga permisos

```
      ↓
```

Genera sesión

```

---

# 5. Eventos con Auth

Usuario publica:

```

UsuarioCreado

```

Auth puede:

- Crear credenciales.
- Enviar invitación.

---

Usuario publica:

```

UsuarioCancelado

```

Auth debe:

- Revocar sesiones.
- Bloquear acceso.

---

# 6. Integración con Notificaciones

Objetivo:

Enviar comunicaciones.

Ejemplos:

- Invitación usuario.
- Cambio de rol.
- Suspensión.
- Recuperación acceso.

---

Eventos utilizados:

```

UsuarioCreado

UsuarioRolCambiado

UsuarioSuspendido

UsuarioCancelado

```

---

Ejemplo:

```

UsuarioCreado

```
  ↓
```

Notificaciones

```
  ↓
```

Enviar WhatsApp/email

```

---

# 7. Integración con WhatsApp

Uso futuro:

Usuarios pueden tener:

- Número WhatsApp.
- Canal de comunicación.
- Verificación.

---

Posibles eventos:

```

UsuarioTelefonoAsignado

UsuarioVerificado

```

---

Regla:

WhatsApp no debe controlar permisos.

El permiso siempre pertenece al módulo Usuario.

---

# 8. Integración con IA / Agentes

Abiel Core utiliza agentes inteligentes.

Usuario puede aportar:

- Preferencias.
- Rol.
- Permisos.
- Contexto empresarial.

---

Ejemplo:

Un agente consulta:

```

¿Qué puede hacer este usuario?

```

Respuesta:

```

Usuario:
Juan

Empresa:
Barbería X

Rol:
OPERADOR

Permisos:
ventas=true
configuracion=false

```

---

# 9. Integración con Auditoría

Todas las acciones sensibles deben registrarse.

Eventos:

```

UsuarioCreado

UsuarioActualizado

UsuarioRolCambiado

UsuarioSuspendido

UsuarioCancelado

````

---

Ejemplo:

Evento:

```json
{
 "usuarioId":"123",
 "accion":"CAMBIO_ROL",
 "realizadoPor":"456"
}
````

---

# 10. Integración mediante eventos

Regla:

Usuario no llama directamente:

```
Usuario → Notificaciones
```

Preferido:

```
Usuario

 ↓

Evento

 ↓

Notificaciones
```

---

Ventajas:

* Menor acoplamiento.
* Escalabilidad.
* Nuevos consumidores sin modificar Usuario.

---

# 11. Contratos externos

El módulo expone:

## Commands

Ejemplos:

```
CrearUsuario

ActualizarUsuario

ActivarUsuario

SuspenderUsuario

CancelarUsuario

CambiarRolUsuario
```

---

## Events

Ejemplos:

```
UsuarioCreado

UsuarioActualizado

UsuarioActivado

UsuarioSuspendido

UsuarioCancelado

UsuarioRolCambiado
```

---

# 12. Reglas de integración

Todo módulo que use Usuario debe:

✅ Validar empresa.

✅ Respetar permisos.

✅ No modificar directamente la entidad.

✅ Usar casos de uso.

✅ Consumir eventos.

---

# 13. Futuras integraciones

Preparado para:

* Facturación.
* CRM.
* Ventas.
* Automatizaciones n8n.
* Agentes IA.
* Panel administrativo.
* Marketplace de plugins.

---

# Estado del documento

Versión:

Usuario v0.1

Estado:

Integraciones definidas.

```

Siguiente documento:

**27-flujos-del-modulo.md**

Ahí documentamos los flujos completos paso a paso:
- Alta de usuario.
- Invitación.
- Activación.
- Login.
- Cambio de rol.
- Suspensión.
- Baja.
```
