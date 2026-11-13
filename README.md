# CampusTrade

Aplicación universitaria para venta, renta, intercambio y donación de materiales académicos. La versión 0.3.0 conserva React 18 y Vite y conecta la interfaz a una API Node.js con PostgreSQL. Las entregas se acuerdan dentro del campus; no se integran pagos en línea.

La interfaz adopta el diseño minimalista de CampusTrade: blanco, Inter local y acciones teal, con búsqueda en la barra superior, tarjetas sin borde y cinco opciones de navegación móvil. Incluye filtros con chips, detalle y chat adaptados al celular, vistas conservadas en la URL y ayudas de registro. Consulta la [guía de diseño](docs/DESIGN.md) y la [validación del incremento](docs/diseno-minimal/2026-11-11/README.md).

**Sistema local:** [Abrir CampusTrade](http://127.0.0.1:3000/) · [Health de API](http://127.0.0.1:3000/api/v1/health) · [Buzón de recuperación de pruebas](http://127.0.0.1:8025/). React, API, PostgreSQL e imágenes persistentes se ejecutan en Docker. Los datos de Neon y el objeto de Supabase se copiaron a esta instalación. El registro ya no requiere confirmar el correo; Mailpit se utiliza únicamente para recuperación de contraseña.

El 10 de noviembre de 2026 se suspendió Render después de validar la copia local. Supabase permanece pausado y Neon se conserva como respaldo; no se eliminaron proyectos ni datos remotos. El [registro de migración](docs/docker-local/2026-11-10/cutover.json) conserva la verificación del cambio.

## Inicio con Docker

En esta computadora puedes ejecutar `iniciar-docker.cmd` o:

```powershell
docker compose up -d --build --wait
```

La aplicación está en `http://127.0.0.1:3000`. Para una instalación nueva ejecuta antes `npm run docker:setup`, que genera el `.env` privado. Para incluir el buzón escolar ejecuta después `npm run mail:demo:setup`, antes de iniciar Compose. PostgreSQL, las imágenes y el buzón se conservan en volúmenes al detener o recrear los contenedores. La guía [Docker local](docs/DOCKER_LOCAL.md) documenta la base migrada, los respaldos, las pruebas y las diferencias con el entorno de desarrollo anterior.

Por solicitud del responsable se retiró la confirmación de correo del registro, la API y las restricciones de la interfaz. Una cuenta registrada puede iniciar sesión, publicar, escribir y solicitar operaciones sin consumir un enlace. Se mantiene el dominio `itesa.edu.mx`, la contraseña y la autorización de recursos y roles. No se acredita la titularidad del buzón institucional. Consulta [registro sin confirmación](docs/REGISTRO_SIN_CONFIRMACION.md) y [recuperación con correo local](docs/CORREO_DEMO.md).

## Desarrollo con Node fuera de Docker

Requiere Node.js 24, npm y Docker con el motor iniciado.

1. Ejecuta `npm ci` desde la raíz.
2. Ejecuta `npm run docker:setup` para preparar el `.env` privado y copia `backend/.env.example` a `backend/.env` si aún no existe.
3. Configura `DATABASE_URL` de `backend/.env` con la contraseña PostgreSQL del `.env` y una clave APP_SECRET de al menos 32 caracteres. Este entorno separado de desarrollo utiliza la base indicada en esa URL; no cambia la conexión de la app Docker.
4. Mantén `ALLOWED_EMAIL_DOMAINS=itesa.edu.mx`, dominio confirmado para este proyecto. El transporte de correo es opcional para el registro y se utiliza únicamente para recuperar contraseñas.
5. Inicia la base y aplica las migraciones:

```bash
docker compose up -d db
npm run migrate
npm run build
npm start
```

Abre la URL que imprime el servidor, normalmente http://127.0.0.1:3000. Node sirve la API y `frontend/dist/` desde el mismo origen. `iniciar-dev.cmd` revisa dependencias, compila e inicia ese servidor; PostgreSQL y los archivos de configuración deben estar preparados.

Para desarrollar con recarga, usa dos terminales: `npm run dev:api` y `npm run dev`. Vite reenvía `/api` al backend local en el puerto 3000.

## Estado comprobado

- API con registro sin confirmación de correo, sesiones revocables, CSRF y recuperación de contraseña por enlace.
- Catálogo paginado, búsqueda, filtros, publicaciones autorizadas, imágenes de hasta 5 MB y favoritos persistentes.
- API de conversaciones privadas, operaciones transaccionales, rentas, intercambios, calificaciones, reportes y administración.
- Interfaz conectada para registro, login, recuperación, perfil, catálogo, creación y edición, imágenes, favoritos, mensajes entre cuentas, operaciones, calificaciones, reportes y gestión administrativa.

El registro no envía mensajes ni genera tokens de verificación. Las cuentas anteriores también pueden operar sin confirmar el correo; conservan sus credenciales, roles e historial. Se retiraron las insignias de verificación. Los campos históricos `verified` y `verified_at` se mantienen por compatibilidad, sin intervenir en permisos ni actualizarse automáticamente. La recuperación usa enlaces de un solo uso; el envío real requiere SMTP o Resend, y en esta computadora se captura únicamente en Mailpit. Las pruebas usan cuentas sintéticas en esquemas aislados.

## Validación

```bash
npm test
npm run test:api
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
```

Las pruebas de API y navegador requieren PostgreSQL local. Cada ejecución full stack crea un esquema separado y cuentas sintéticas; el servidor de pruebas solo escucha en loopback, exige una clave de ejecución y no forma parte de la aplicación productiva. Los recorridos usan el compilado real, cookies de sesión y datos PostgreSQL.

La [validación del registro sin confirmación](docs/registro-sin-confirmacion/2026-11-12/README.md) documenta las pruebas del comportamiento actual. La [validación inicial del correo local](docs/correo-demo/2026-11-12/README.md) se conserva como evidencia histórica del flujo anterior.

El prototipo anterior sigue en AppShell como demostración explícita con `VITE_DEMO_MODE=true`. No se usa como sustituto de una API ausente y no es el modo predeterminado. Sus pruebas de regresión se conservan.

## Documentación

- [Auditoría inicial](docs/AUDITORIA_INICIAL.md)
- [Contrato de API](docs/API.md)
- [Base de datos y migraciones](docs/DATABASE.md)
- [Seguridad y activaciones pendientes](docs/SECURITY.md)
- [Backlog](docs/BACKLOG.md)

Las entregas anteriores documentan el despliegue público con servicios reales y HTTPS. La instalación actual usa Docker local. No se ha contratado ningún servicio de pago.

La entrega histórica y sus siete apartados están en [entregable final](entregables/entregable_final/README.md). La configuración anterior de Render está en [render.yaml](render.yaml), y sus evidencias en [despliegue anterior](docs/DEPLOYMENT.md). Para ejecutar ahora el sistema completo usa [Docker local](docs/DOCKER_LOCAL.md), con base de código 0.3.0 y las correcciones de seguridad posteriores.

La evaluación del 7 de noviembre de 2026 está en el [entregable de testing](entregables/entregable_testing/README.md): ocho apartados, 97 casos ejecutados con resultados y un PDF con formularios editables. El apartado 8 incorpora una sesión del 8 de noviembre con trece comprobaciones y comentarios propios de Codex, identificados como evaluación del agente.

La [entrega actualizada del 12 de noviembre](entregables/entregable_testing_2026-11-12/README.md) documenta el registro sin confirmación de correo del código publicado `0274f2b`: ocho apartados, 137 pruebas de aplicación y 14 comprobaciones complementarias aprobadas, 151 fichas completas, seis issues cerrados con comentarios y ocho registros de interacción de Codex. Incluye un reporte Word de 51 páginas y un formulario con ocho campos editables. Los comentarios corresponden a pruebas del agente con cuentas sintéticas, sin estudiantes externos.

La ampliación [casos de prueba con fotos](entregables/entregable_testing_2026-11-12/CampusTrade_Casos_Prueba_Con_Fotos_2026-11-12.docx) relaciona las 151 fichas con 32 capturas reales de escritorio y móvil y 30 capturas de los reportes técnicos. Los 26 recorridos de navegador se revalidaron para obtener estas imágenes; no se suman como casos nuevos.

El [Word unificado del 13 de noviembre](entregables/entregable_testing_2026-11-12/CampusTrade_Testing_Unificado_Con_Fotos_2026-11-13.docx) integra ambos documentos en 169 páginas. Las 151 fichas conservan sus pasos, resultados y capturas en la misma página; las 125 fichas técnicas repiten el reporte de grupo que contiene la fila correspondiente a cada caso. Conserva 69 imágenes originales distintas, insertadas 164 veces, con las fechas originales de ejecución y numeración continua. El [índice de fichas](entregables/entregable_testing_2026-11-12/indice_casos_word.json) relaciona casos, páginas y evidencias. El formulario de corrección con ocho campos editables está dentro del apartado 3. La consulta del 13 de noviembre confirmó nuevamente seis issues cerrados con comentarios. Los apartados 4 y 7 incluyen cuatro capturas reales de GitHub: issues cerrados, comentario de resolución, commit de implementación e historial de la rama publicada.

La [entrega del 11 de noviembre](entregables/entregable_testing_2026-11-11/README.md), con 131 pruebas sobre `2075900`, y la [entrega del 9 de noviembre](entregables/entregable_testing_2026-11-09/README.md) se conservan como históricas.

También está disponible la [versión editable en Word](entregables/entregable_testing_2026-11-09/word/README.md), con los ocho apartados, los 101 casos completos y un formulario de ocho campos nativos.
