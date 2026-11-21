# auth-service

[Español](README.es.md)

Authentication microservice for the educational blog, using JWT and MySQL persistence through TypeORM.

Part of an abandoned learning exercise exploring service boundaries and request/response communication. Kept without active maintenance; not intended for production.

## Stack

NestJS · TypeScript · TCP · TypeORM · MySQL.

## Scope and configuration

MICROSERVICE_HOST/MICROSERVICE_PORT default to localhost:4000. Configure DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE or DB_URL, and SECRET_KEY. TypeORM enables synchronize. Refresh-token comparison is incomplete and password-reset delivery has no mail integration; this code is not suitable for real authentication.

## Local development

Use a Node.js toolchain compatible with package.json and the dependency lockfile, when present.

```sh
npm install
npm run start:dev
npm run build
npm test
```

## Related repositories

- [Blog practice / Práctica de blog](https://github.com/matigaleanodev/blog-personal)
