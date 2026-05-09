# Bouri Events Backend

Spring Boot 3 backend for Bouri Events.

## Stack

- Java 21
- Maven
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- Lombok
- MySQL Driver
- OpenAPI / Swagger

## Package

`com.bourievents`

## Environment variables

Set these before running in production/dev environments:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`

Default local database URL pattern:

`jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:bouri_events_db}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC`

## Run

```bash
cd backend
mvn spring-boot:run
```

## Endpoints

- Health: `GET http://localhost:8080/api/health`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

