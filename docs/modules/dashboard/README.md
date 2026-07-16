# Módulo Dashboard

## Propósito

Interfaz de gestión, monitoreo y configuración del sistema para administradores y operadores. Consume la API REST del módulo API y presenta información en tiempo real.

**Usuarios objetivo:**
- Administradores SaaS (visión global)
- Owners de empresas (gestión de su tenant)
- Operadores (gestión de conversaciones y clientes)

---

## Vistas planificadas

### Gestión de empresas (Admin SaaS)

| Vista | Descripción |
|-------|-------------|
| Lista de empresas | Estado, plan, fecha de creación, actividad reciente |
| Detalle de empresa | Información completa, usuarios, métricas |
| Crear / editar empresa | Formulario con validación |
| Cambiar estado | Activar / Suspender / Cancelar |

### Gestión de usuarios

| Vista | Descripción |
|-------|-------------|
| Lista de usuarios | Filtro por rol, estado, empresa |
| Detalle de usuario | Actividad, rol, estado |
| Crear / editar usuario | Formulario |
| Cambiar estado | Activar / Suspender / Cancelar |

### Panel de conversaciones

| Vista | Descripción |
|-------|-------------|
| Bandeja de conversaciones | Por estado: BOT_ACTIVE, HUMAN_ACTIVE, HUMAN_LOCKED |
| Detalle de conversación | Historial, estado actual, botones de acción |
| Tomar control | Disparar `BloquearConversacionUseCase` |
| Devolver al bot | Disparar `ReanudarBotUseCase` |

### Métricas (futuro)

| Métrica | Descripción |
|---------|-------------|
| Mensajes procesados | Por empresa, por día |
| Tiempo de respuesta | Promedio del LLM |
| Intervenciones humanas | Frecuencia por empresa |
| Tasa de cierre | Flujos completados vs iniciados |

---

## Arquitectura del dashboard

```
Dashboard (SPA o SSR)
       │
       ↓
API Module (HTTP)
       │
       ↓
Use Cases
       │
       ↓
Dominio + Infraestructura
```

El dashboard no accede directamente a la base de datos ni a los módulos de negocio. Todo pasa por la API.

---

## Tecnología (a definir)

- **Frontend:** React / Next.js (por confirmar)
- **Estado:** React Query para sincronización con la API
- **Autenticación:** JWT almacenado en httpOnly cookie
- **Tiempo real:** WebSocket o Server-Sent Events para actualizaciones de conversaciones

---

## Consideraciones de seguridad

- El dashboard no almacena datos sensibles en localStorage.
- Todas las acciones validan tenant isolation a nivel de API.
- Los roles del sistema controlan qué vistas y acciones están disponibles para cada usuario.
