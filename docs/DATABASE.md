# Base de datos y migraciones

PostgreSQL 17 real, no almacenamiento del navegador. `001_initial.sql` crea catorce tablas de negocio; `schema_migrations` registra versiones. `002_operation_amounts.sql` amplía el importe a bigint para rentas de hasta noventa días. UUID, claves foráneas, CHECK de rangos, unicidad de email/matrícula HMAC, índices de participantes y favoritos preservan integridad.

```mermaid
erDiagram
  USERS ||--o{ SESSIONS : inicia
  USERS ||--o{ ACCESS_TOKENS : verifica_recupera
  CAREERS ||--o{ USERS : pertenece
  USERS ||--o{ LISTINGS : publica
  CATEGORIES ||--o{ LISTINGS : clasifica
  LISTINGS ||--o{ LISTING_IMAGES : referencia
  USERS ||--o{ FAVORITES : guarda
  LISTINGS ||--o{ FAVORITES : favorito
  LISTINGS ||--o{ CONVERSATIONS : origina
  USERS ||--o{ CONVERSATIONS : participa
  CONVERSATIONS ||--o{ MESSAGES : contiene
  LISTINGS ||--o{ OPERATIONS : solicita
  USERS ||--o{ OPERATIONS : interesado
  OPERATIONS ||--o{ RATINGS : permite
  USERS ||--o{ RATINGS : autor_destinatario
  LISTINGS ||--o{ REPORTS : recibe
  USERS ||--o{ REPORTS : reporta
  USERS ||--o{ AUDIT_EVENTS : administra
```

Los precios se guardan en centavos; las fechas de renta son DATE y la API devuelve YYYY-MM-DD. Fechas de eventos usan timestamptz. No se guardan binarios de imágenes ni contraseñas en claro. listing_images contiene propietario, publicación, object_key, tipo y tamaño. La tabla operations referencia publicación principal, solicitante y oferta opcional; ratings infiere el destinatario desde la operación.

La aceptación bloquea filas de publicaciones en orden UUID dentro de una misma conexión y transacción. El índice parcial one_accepted_operation_idx complementa las reglas del servicio. Se rechazan solicitudes incompatibles; los terminales no se reabren. Retirar una oferta cancela solicitudes pendientes relacionadas. Eliminar imágenes pendientes bloquea su fila antes de borrar la referencia, evitando competir con su asociación a una publicación.

El ejecutor toma bloqueo asesor, normaliza CRLF/LF para el checksum, aplica migraciones pendientes en transacción y rechaza cambios a archivos aplicados. Ejecutar `npm run migrate` o `npm start` (migra antes de escuchar). Para cambios posteriores crear otra migración; no editar 001 ni 002.

Desarrollo: Docker, puerto 127.0.0.1:55432, volumen campustrade_postgres_data. Las pruebas rechazan hosts remotos, crean un esquema test_UUID por suite y eliminan solo ese esquema y sus archivos. La prueba persistence.test.js inicia dos procesos Node sucesivos y comprueba publicación y sesión conservadas. No demuestra todavía recuperación ante pérdida de disco o restauración de backup.

Respaldo operativo: `pg_dump --format=custom` hacia un archivo fuera de Git usando credenciales solo desde el entorno; guardar también objetos e inventario. Probar `pg_restore` primero en una base nueva, verificar migraciones/health y los flujos antes de cambiar el servicio. No usar docker compose down -v para reiniciar.

## Instalación Docker migrada el 10 de noviembre de 2026

La base de Neon se restauró en `campustrade_docker`, dentro del PostgreSQL local, y la base anterior `campustrade` se conservó. Las quince tablas coincidieron en recuentos y hashes antes y después de suspender Render. La aplicación usa `campustrade_app`, sin privilegios de superusuario, creación de bases/roles ni BYPASSRLS; conserva propiedad de su base para las migraciones de arranque. La [guía Docker](DOCKER_LOCAL.md) detalla volúmenes, respaldos y verificación. La restauración del dump y del objeto WebP fue validada; no se ensayó una pérdida física del disco del host.
