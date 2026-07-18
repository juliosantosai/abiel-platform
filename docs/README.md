# Abiel Core - Documentación

## Estado actual

- Arquitectura orientada a framework y módulos bien delimitados.
- Migración a TypeScript activa y punto de entrada principal en TypeScript.
- Compatibilidad con el flujo anterior preservada mediante scripts de arranque y wrappers de transición.

## Guías principales

- [arquitectura/vision.md](arquitectura/vision.md): visión general, capas y principios.
- [arquitectura/estructura.md](arquitectura/estructura.md): estructura de carpetas y convenciones.
- [arquitectura/modulos.md](arquitectura/modulos.md): módulos del sistema y su responsabilidad.
- [arquitectura/flujos.md](arquitectura/flujos.md): flujo de eventos, ejecución y orquestación.
- [arquitectura/desarrollo.md](arquitectura/desarrollo.md): reglas para desarrollar, probar y mantener el proyecto.

## Módulos activos

- [modules/empresa/README.md](modules/empresa/README.md)
- [modules/usuario/README.md](modules/usuario/README.md)
- [modules/human-intervention/README.md](modules/human-intervention/README.md)
- [modules/whatsapp-sender/README.md](modules/whatsapp-sender/README.md)

## Uso rápido

```bash
npm install
npx prisma generate
npm start
```

Nota: el arranque del runtime está centralizado en `src/bootstrap/RuntimeBootstrap.ts`.
Los scripts de inicio (`npm start`, `npm run start:api:mock`) delegan en este bootstrap.

## Notas

- La documentación histórica y de transición ha sido consolidada o eliminada para reducir ruido y mantener la guía orientada a la arquitectura actual.
