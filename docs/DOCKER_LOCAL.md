# CampusTrade en Docker local

La aplicación completa usa `app`, que sirve React compilado y la API Express, y `db`, con PostgreSQL 17. El perfil opcional `correo-demo` agrega `mailpit` para capturar correos de demostración. Las imágenes y los mensajes se guardan en volúmenes locales. La aplicación local no necesita Render, Neon ni Supabase para funcionar.

## Iniciar y detener

En esta computadora ya están configurados los secretos y los datos migrados:

```powershell
docker compose up -d --build --wait
docker compose ps
```

Abre [CampusTrade local](http://127.0.0.1:3000). También puedes ejecutar `iniciar-docker.cmd`. Para detenerlo sin borrar datos:

```powershell
docker compose down
```

Para una instalación nueva, con Docker Desktop iniciado y Node 24 disponible para generar la configuración inicial:

```powershell
npm run docker:setup
npm run mail:demo:setup
docker compose up -d --build --wait
```

El asistente genera secretos en `.env`, excluido de Git, y conserva los valores existentes. Las dependencias y el frontend se construyen dentro de Docker; no hace falta instalar Node para iniciar una instalación cuyo `.env` ya esté preparado. El asistente no migra automáticamente cuentas de la nube ni reemplaza una base existente. Si se importa una instalación, hay que conservar su `APP_SECRET`, usado en el HMAC de matrícula.

`mail:demo:setup` es opcional y ya se ejecutó en esta computadora. Conserva una copia privada anterior del `.env`, mantiene las credenciales existentes y activa `COMPOSE_PROFILES=correo-demo`. Rechaza sustituir un proveedor externo configurado. El buzón está en [127.0.0.1:8025](http://127.0.0.1:8025/); SMTP 1025 solo es accesible dentro de la red de Docker. Consulta [Correo de demostración](CORREO_DEMO.md) para usarlo.

## Datos y configuración

| Recurso                     | Ubicación actual                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Aplicación                  | `127.0.0.1:3000`; usuario Linux `node`, filesystem de solo lectura y volumen de imágenes escribible                          |
| PostgreSQL                  | Contenedor `db`, accesible desde el host en `127.0.0.1:55432`                                                                |
| Base migrada                | `campustrade_docker`, en el volumen existente `campustrade_postgres_data`                                                    |
| Base anterior de desarrollo | `campustrade`, conservada en el mismo servidor; `backend/.env` sigue apuntando allí para desarrollo y pruebas aisladas       |
| Rol de aplicación           | `campustrade_app`: sin SUPERUSER, CREATEDB, CREATEROLE ni BYPASSRLS; propietario de su base para las migraciones de arranque |
| Imágenes                    | Volumen `campustrade_images_data`, montado en `/app/backend/.data/images`                                                    |
| Buzón de demostración       | Mailpit en `127.0.0.1:8025`, con volumen `campustrade_mailpit_data`; perfil `correo-demo`                                    |
| Respaldo privado            | `backend/.data/docker-migration-2026-11-10/`; dump PostgreSQL, ZIP de Supabase, copias previas de configuración e inventario |
| Secretos                    | `.env` local; no se copian al contexto de build ni a Git                                                                     |

En una instalación nueva la base predeterminada se llama `campustrade`; la instalación migrada utiliza `POSTGRES_DB=campustrade_docker` para conservar la base anterior. Las variables `CAMPUS_PORT` y `POSTGRES_PORT` permiten elegir puertos del host. La API utiliza el nombre de servicio `db` dentro de la red de Compose, nunca `localhost` para conectar entre contenedores.

El script `docker/init-app-role.sh` se ejecuta solo al inicializar un volumen PostgreSQL vacío. Cambiar valores en `.env` no cambia contraseñas ni crea roles en un volumen existente. No borres ese volumen para resolver una discrepancia de configuración: revisa primero la conexión y conserva un respaldo.

`NODE_ENV=development` corresponde a este uso por HTTP en loopback y permite almacenamiento local. No se usa modo test; permanecen los límites de peticiones, permisos, CSRF y validación de dominio. Producción exige HTTPS y S3 y rechaza `local_demo`. Esta composición no debe exponerse directamente a Internet. El registro admite `itesa.edu.mx` sin confirmar el buzón; las cuentas registradas pueden publicar y conversar. Mailpit captura únicamente enlaces de recuperación de contraseña, sin enviarlos a correos reales ni acreditar su titularidad.

## Migración realizada

Se exportó el esquema público de Neon con `pg_dump` en formato custom, sin propietarios ni ACL de la nube. Se restauró en una base nueva y se compararon hashes y recuentos de sus quince tablas, incluidas las migraciones: todas coincidieron. El origen contenía una cuenta, tres carreras, cuatro categorías y dos migraciones; no había publicaciones ni referencias de imagen.

El proyecto de Supabase estaba pausado. Se descargó el ZIP de objetos desde su panel y se conservó el proyecto pausado. El respaldo contenía un WebP de 76 bytes sin referencia en la base; ese objeto también se conservó en el volumen de imágenes. No se inventaron publicaciones para mostrarlo.

La primera restauración se revirtió por un `CREATE SCHEMA public` ya existente en la base nueva. Se omitió únicamente esa entrada del listado de restore y se completó la restauración transaccional sin borrar el esquema. La base anterior y las fuentes remotas se conservaron.

## Verificación reproducible

La imagen final pasó nueve recorridos Docker, cincuenta pruebas de API y cuarenta y siete de frontend: 106 comprobaciones aprobadas en esta entrega. La cuenta sintética migrada pudo iniciar y cerrar sesión localmente; esa sesión se revocó al terminar. Después de suspender Render se volvieron a comparar las quince tablas de origen y destino y todas coincidieron.

```powershell
npm run test:docker
npm run test:api
npm test
```

`test:docker` crea un proyecto `campustrade-smoke-<id>` con puertos, secretos y volúmenes propios. Comprueba arranque limpio, rol limitado, registro sin confirmación, permisos, CSRF, subida y lectura de imagen, mensajes, venta, calificación, retiro y persistencia al recrear API y PostgreSQL. Sus cuentas sintéticas operan sin actualizar `verified_at`. Al terminar elimina solo ese proyecto y sus volúmenes, conservando la instalación migrada. El resultado predeterminado queda en `tmp/docker-smoke-result.json`; `DOCKER_EVIDENCE_PATH` permite guardarlo en otro archivo.

La primera ejecución alcanzó siete comprobaciones y falló al reconectar después de la recreación. El arnés se ajustó para cerrar conexiones HTTP entre solicitudes y comprobar explícitamente la sesión persistida; la repetición completó las nueve comprobaciones. Se conserva el resultado inicial junto al final en [evidencia Docker](docker-local/2026-11-10/).

No se debe usar `docker compose down -v` en la instalación con datos: esa opción elimina volúmenes. Para respaldos posteriores, guardar un dump PostgreSQL y una copia del volumen de imágenes fuera de Git y verificar una restauración en una base separada.

## Estado del retiro de la nube

| Recurso                        | Estado verificado el 10-11-2026                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| CampusTrade local              | HTTP 200 y PostgreSQL conectado en `http://127.0.0.1:3000`                                                   |
| Render `campustrade-mex-per`   | Suspendido por solicitud del usuario; panel “Suspended by you” y health público 503 con página de suspensión |
| Supabase `campustrade-storage` | Ya estaba pausado; se descargó el respaldo de objetos y se mantuvo pausado                                   |
| Neon                           | Conservado como origen de respaldo; los datos permanecieron sin cambios                                      |

El incremento Docker probado se guardó en el commit local `6d56a90` antes de suspender Render. El código se conserva en `codex/docker-local-2026-11-10`; no se hizo push a GitHub. Las evidencias están en [cutover.json](docker-local/2026-11-10/cutover.json), [migration.json](docker-local/2026-11-10/migration.json) y [captura de Render](docker-local/2026-11-10/render-suspended.jpg).

La copia local es HTTP en loopback, pensada para esta computadora. Compartirla fuera del equipo requiere otra configuración de red y HTTPS. Los respaldos privados contienen datos y configuración; se conservan en `backend/.data/`, excluidos de Git y de la imagen Docker. La rotación de la credencial remota sigue pendiente por decisión del usuario y no se cambió como parte de esta migración.

Referencias: [arranque y healthchecks de Docker Compose](https://docs.docker.com/compose/how-tos/startup-order/) y [respaldo PostgreSQL con pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html).
