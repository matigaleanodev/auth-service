# auth-service

[English](README.md)

Microservicio de autenticación del blog educativo, con JWT y persistencia MySQL mediante TypeORM.

Forma parte de una práctica abandonada para explorar separación de servicios y comunicación solicitud/respuesta. Se conserva sin mantenimiento activo; no está destinada a producción.

## Stack

NestJS · TypeScript · TCP · TypeORM · MySQL.

## Alcance y configuración

MICROSERVICE_HOST/MICROSERVICE_PORT usan localhost:4000 por defecto. Configurar DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE o DB_URL, y SECRET_KEY. TypeORM habilita synchronize. La comparación de refresh tokens está incompleta y la recuperación no integra envío de correo; este código no es apto para autenticación real.

## Desarrollo local

Usar un entorno Node.js compatible con package.json y el lockfile de dependencias, cuando exista.

```sh
npm install
npm run start:dev
npm run build
npm test
```

## Repositorios relacionados

- [Blog practice / Práctica de blog](https://github.com/matigaleanodev/blog-personal)
