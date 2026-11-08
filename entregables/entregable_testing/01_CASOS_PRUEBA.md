# Casos de prueba ejecutados de CampusTrade

Corte 7 de noviembre de 2026. Commit probado `420a9bb89c91164cebc21e9e4a4a5a5173f81ff8`. Se identifican 97 casos distintos: 47 frontend, 34 API/config, 10 navegador y seis comprobaciones de producción. Cada registro incluye módulo, procedimiento, esperado, obtenido, estado, fecha, fuente y evidencia. Repetir frontend en CI no aumenta ese total. Las 44 regresiones del prototipo se distinguen de las tres pruebas HTTP.

## API-AUTH-01 registro institucional almacena hash y nunca inventa la verificación

- Módulo: Cuentas y sesiones. Requisito: RF-01 RF-02.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Registrar fixture institucional; consultar campos devueltos y hashes almacenados.
- Resultado esperado: HTTP 201; verified=false; hash Argon2 y matrícula HMAC, sin hashes en respuesta.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 201.66 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/auth.test.js:16`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-AUTH-02 rechaza dominios ajenos, contraseñas cortas, roles y duplicados

- Módulo: Cuentas y sesiones. Requisito: RF-01 RF-02.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Enviar dominio con sufijo ajeno, contraseña corta y role=admin; repetir cuenta válida.
- Resultado esperado: HTTP 400 para entradas o rol indebidos y 409 para cuenta duplicada.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 59.28 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/auth.test.js:31`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-AUTH-03 el enlace de verificación es de un solo uso

- Módulo: Cuentas y sesiones. Requisito: RF-02.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Consumir dos veces el token de verificación del transporte aislado.
- Resultado esperado: Primera petición 200 y segunda 400; token de un solo uso.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 14.86 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/auth.test.js:53`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-AUTH-04 sesión HttpOnly, CSRF, persistencia y cierre revocable

- Módulo: Cuentas y sesiones. Requisito: RF-01.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Iniciar sesión; consultar sesión; intentar logout sin CSRF; cerrar con CSRF y volver a consultar.
- Resultado esperado: Cookie HttpOnly; sin CSRF 403; cierre válido 200; sesión final null.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 63.77 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/auth.test.js:61`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-AUTH-05 recuperación cambia la contraseña y revoca las sesiones previas

- Módulo: Cuentas y sesiones. Requisito: RF-01.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Solicitar token de recuperación; confirmar contraseña nueva; reutilizar sesión anterior e intentar clave anterior.
- Resultado esperado: Confirmación 200; sesión anterior revocada; clave anterior devuelve 401.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 159.60 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/auth.test.js:96`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-AUTH-06 rechaza orígenes extraños y tokens vencidos

- Módulo: Cuentas y sesiones. Requisito: RF-01 RF-02.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Enviar login desde origen ajeno; caducar token en la base de pruebas e intentar verificar.
- Resultado esperado: Origen ajeno 403; token vencido 400.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 66.77 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/auth.test.js:130`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONFIG-01 Render proporciona el origen HTTPS inicial sin adivinar el dominio asignado

- Módulo: Configuración de producción. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Cargar configuración productiva con RENDER_EXTERNAL_URL y S3 configurado, sin PUBLIC_URL.
- Resultado esperado: Origen HTTPS asignado y dominio itesa.edu.mx detectados exactamente.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 2.02 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/config.test.js:17`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONFIG-02 PUBLIC_URL y CORS_ORIGINS explícitos prevalecen sobre el dominio de Render

- Módulo: Configuración de producción. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Definir PUBLIC_URL y CORS_ORIGINS junto con un dominio distinto de Render.
- Resultado esperado: La configuración explícita prevalece y conserva los orígenes especificados.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 1.91 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/config.test.js:26`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONFIG-03 la detección de Render no permite HTTP ni orígenes con rutas

- Módulo: Configuración de producción. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Probar origen HTTP y origen HTTPS con ruta en configuración productiva.
- Resultado esperado: Ambas configuraciones generan error, sin permitir origen inseguro o con ruta.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 0.66 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/config.test.js:39`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONFIG-04 producción sigue rechazando URL ausente y almacenamiento local

- Módulo: Configuración de producción. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Cargar producción sin URL; repetir con URL HTTPS y almacenamiento local.
- Resultado esperado: Arranque rechazado por HTTPS ausente o por requerir S3 persistente.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 0.84 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:20-06:00.
- Fuente: `backend/test/config.test.js:57`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONVERSATIONS-01 conversación única entre participantes distintos

- Módulo: Mensajes privados. Requisito: RF-09.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Intentar conversar sobre artículo propio; abrir dos veces como comprador.
- Resultado esperado: Artículo propio 400; conversación válida 201; reapertura conserva el mismo ID.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 517.33 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:21-06:00.
- Fuente: `backend/test/conversations.test.js:14`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONVERSATIONS-02 mensaje del comprador llega al vendedor y persiste

- Módulo: Mensajes privados. Requisito: RF-09 RF-13.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Enviar mensaje con espacios; consultarlo desde vendedor y desde la base.
- Resultado esperado: Mensaje 201, texto recortado, mismo contenido para vendedor y una fila persistida.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 11.42 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:21-06:00.
- Fuente: `backend/test/conversations.test.js:31`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-CONVERSATIONS-03 bloquea lectura escritura y suplantación por terceros

- Módulo: Mensajes privados. Requisito: RF-09.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Un tercero intenta leer y enviar; participante manda texto vacío, NUL y senderId ajeno.
- Resultado esperado: Tercero 403; texto inválido y suplantación 400.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 11.03 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:21-06:00.
- Fuente: `backend/test/conversations.test.js:51`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-DATABASE-01 migraciones PostgreSQL idempotentes y catálogo inicial

- Módulo: PostgreSQL y migraciones. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Aplicar migraciones dos veces sobre base de pruebas; contar migraciones y consultar catálogo.
- Resultado esperado: Dos migraciones registradas; catálogo HTTP 200 con cuatro categorías iniciales.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 122.78 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:21-06:00.
- Fuente: `backend/test/database.test.js:12`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-DATABASE-02 health confirma la conexión real y no expone secretos

- Módulo: PostgreSQL y migraciones. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Consultar GET /api/v1/health sobre aplicación conectada a PostgreSQL.
- Resultado esperado: HTTP 200, database=connected y ausencia de cabecera x-powered-by.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 6.06 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:21-06:00.
- Fuente: `backend/test/database.test.js:26`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-DATABASE-03 rollback conserva la integridad cuando falla una escritura

- Módulo: PostgreSQL y migraciones. Requisito: Infraestructura.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Insertar categoría dentro de transacción; provocar excepción; consultar el nombre insertado.
- Resultado esperado: Rollback deja cero categorías con ese nombre.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 9.08 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:21-06:00.
- Fuente: `backend/test/database.test.js:34`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-LISTINGS-01 publicar exige sesión y correo verificado; no acepta suplantar propietario

- Módulo: Publicaciones e imágenes. Requisito: RF-04.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Publicar sin sesión, sin verificar y con sellerId ajeno; publicar fixture válido del propietario.
- Resultado esperado: 401, 403 y 400 respectivamente; publicación válida 201 con propietario de sesión.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 584.20 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:22-06:00.
- Fuente: `backend/test/listings.test.js:28`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-LISTINGS-02 contenido inválido se rechaza y las consultas están parametrizadas

- Módulo: Publicaciones e imágenes. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Enviar título/descripción vacíos y precios inválidos; buscar con filtros; enviar texto de inyección y límite 100.
- Resultado esperado: Entradas inválidas 400; búsqueda correcta 200; inyección sin efecto, cero resultados; límite 100 rechazado.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 21.42 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:22-06:00.
- Fuente: `backend/test/listings.test.js:53`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-LISTINGS-03 solo el propietario edita y retira; persiste con una nueva instancia de API

- Módulo: Publicaciones e imágenes. Requisito: RF-03 RF-04.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Tercero intenta editar/retirar; propietario cambia título; crear otra instancia de API y consultar.
- Resultado esperado: Tercero 403; edición 200 y título conservado en la nueva instancia.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 20.65 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:22-06:00.
- Fuente: `backend/test/listings.test.js:83`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-LISTINGS-04 favoritos idempotentes se conservan en PostgreSQL

- Módulo: Publicaciones e imágenes. Requisito: RF-10.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Agregar favorito dos veces; consultar desde dos cuentas; retirarlo y consultar de nuevo.
- Resultado esperado: Una sola referencia propia, no visible como favorito ajeno; después cero favoritos.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 33.90 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:22-06:00.
- Fuente: `backend/test/listings.test.js:108`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-LISTINGS-05 la carga verifica MIME contenido extensión y tamaño antes de publicar

- Módulo: Publicaciones e imágenes. Requisito: RF-04 RF-08.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Subir sin verificar, SVG declarado PNG, archivo mayor de 5 MB y extensión incompatible; subir PNG válido y asociarlo al artículo.
- Resultado esperado: 403/400/413/400; PNG válido 201 y lectura pública WebP 200 solo tras asociarlo; imagen ajena 403.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 66.65 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:22-06:00.
- Fuente: `backend/test/listings.test.js:121`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-LISTINGS-06 retirar conserva historial y excluye el artículo del catálogo

- Módulo: Publicaciones e imágenes. Requisito: RF-04.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Retirar publicación propia; consultar detalle y fila persistida.
- Resultado esperado: Retiro 200; detalle 404 y deleted_at conservado sin borrar historial.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 6.50 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:22-06:00.
- Fuente: `backend/test/listings.test.js:190`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-MODERATION-01 reporte persistente evita duplicados y limita acceso administrativo

- Módulo: Reportes y administración. Requisito: RF-12 RF-14.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Crear reporte, repetirlo y consultar como reportante/otro; intentar panel como estudiante.
- Resultado esperado: 201, duplicado 409, reporte visible solo al propio, panel 403.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 505.03 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:23-06:00.
- Fuente: `backend/test/moderation.test.js:18`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-MODERATION-02 administrador revisa resuelve y registra una decisión real

- Módulo: Reportes y administración. Requisito: RF-12 RF-14.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Consultar panel admin; resolver reporte; leer resolución como reportante; intentar reabrir.
- Resultado esperado: Panel/resolución 200; estado resolved persistente; reapertura 409; sin hash expuesto.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 27.59 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:23-06:00.
- Fuente: `backend/test/moderation.test.js:40`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-MODERATION-03 moderación retira contenido sin borrar su historial

- Módulo: Reportes y administración. Requisito: RF-04 RF-14.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Estudiante intenta retirar por ruta administrativa; repetir como admin y consultar detalle/base.
- Resultado esperado: Estudiante 403; admin 200; detalle 404 y registro histórico conservado.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 13.28 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:23-06:00.
- Fuente: `backend/test/moderation.test.js:65`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-MODERATION-04 suspensión revoca sesiones y oculta publicaciones; no modifica administradores

- Módulo: Reportes y administración. Requisito: RF-01 RF-14.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Suspender vendedor y consultar sesión/catálogo; intentar suspender al mismo administrador.
- Resultado esperado: Suspensión 200; sesión null; catálogo sin publicaciones del suspendido; administrador protegido con 400.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 22.62 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:23-06:00.
- Fuente: `backend/test/moderation.test.js:86`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-MODERATION-05 categorías y carreras se administran sin modificar referencias históricas

- Módulo: Reportes y administración. Requisito: RF-07 RF-14.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Crear/desactivar categoría y crear carrera; consultar catálogo.
- Resultado esperado: Altas 201, desactivación 200, carrera disponible y referencias históricas conservadas.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 8.77 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:23-06:00.
- Fuente: `backend/test/moderation.test.js:112`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-OPERATIONS-01 dos aceptaciones simultáneas solo reservan el artículo una vez

- Módulo: Operaciones y calificaciones. Requisito: RF-05.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Crear dos solicitudes para un artículo; aceptar ambas concurrentemente; consultar reserva en base y catálogo.
- Resultado esperado: Respuestas 200 y 409; exactamente una reserva aceptada; artículo reserved.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 503.69 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:24-06:00.
- Fuente: `backend/test/operations.test.js:15`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-OPERATIONS-02 estados terminales bloquean solicitudes y las calificaciones exigen finalización

- Módulo: Operaciones y calificaciones. Requisito: RF-05 RF-11.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Calificar antes de finalizar y finalizar como comprador; finalizar como propietario; repetir solicitud y calificación.
- Resultado esperado: 409 y 403 anticipados; finalización 200; nueva solicitud 409; primera calificación 201 y duplicada 409; reputación 5.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 25.39 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:24-06:00.
- Fuente: `backend/test/operations.test.js:48`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-OPERATIONS-03 cancelar una reserva libera disponibilidad y rechaza terceros

- Módulo: Operaciones y calificaciones. Requisito: RF-05.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Aceptar reserva; intentar cancelar como tercero; cancelar como solicitante y consultar artículo.
- Resultado esperado: Tercero 403; cancelación legítima 200; artículo vuelve a available.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 21.54 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:24-06:00.
- Fuente: `backend/test/operations.test.js:109`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-OPERATIONS-04 renta valida fechas e importe y permite registrar devolución

- Módulo: Operaciones y calificaciones. Requisito: RF-05.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Solicitar renta sin fechas y con tres días a 35; consultar fechas/importe; aceptar, finalizar y registrar devolución.
- Resultado esperado: Sin fechas 400; renta 201; fechas YYYY-MM-DD, importe 105; estado rented y después available.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 32.04 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:24-06:00.
- Fuente: `backend/test/operations.test.js:141`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-OPERATIONS-05 intercambio reserva ambos artículos y no permite reutilizar el ofrecido

- Módulo: Operaciones y calificaciones. Requisito: RF-05.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Ofrecer el mismo artículo en dos intercambios; aceptar simultáneamente desde sus propietarios.
- Resultado esperado: Solo una aceptación 200, otra 409; artículo ofrecido reserved y no reutilizado.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 28.63 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:24-06:00.
- Fuente: `backend/test/operations.test.js:192`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-OPERATIONS-06 retirar una oferta de intercambio cancela las solicitudes pendientes relacionadas

- Módulo: Operaciones y calificaciones. Requisito: RF-04 RF-05.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Solicitar intercambio con artículo propio ofrecido; retirar la oferta; consultar operaciones.
- Resultado esperado: Creación 201, retiro 200 y solicitud relacionada cancelled, nunca pending.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 28.91 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:24-06:00.
- Fuente: `backend/test/operations.test.js:231`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## API-PERSISTENCE-01 publicación y sesión sobreviven al reinicio real del proceso Node

- Módulo: Persistencia entre procesos. Requisito: RF-01 RF-04.
- Entorno y actor: CI Ubuntu Node 24 PostgreSQL 17; Cuentas sintéticas campus.test; configuración sin cuentas donde aplica.
- Procedimiento: Iniciar proceso Node, login y publicación; detenerlo; iniciar PID distinto y consultar artículo con la cookie anterior.
- Resultado esperado: PID distinto; título/precio 123.45 e identidad de sesión conservados en PostgreSQL.
- Resultado obtenido: Node aprobó todas las aserciones del caso. Duración 1260.43 ms. Resultado exacto en la línea de éxito con el mismo nombre.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:26-06:00.
- Fuente: `backend/test/persistence.test.js:8`. Evidencia: [evidencias/api-ci.log](evidencias/api-ci.log).

## FE-APP-01 publica sin errores de evento asíncrono y conserva el artículo al recargar

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Abrir Publicar y enviar vacío; completar campos; publicar; desmontar y volver a montar AppShell.
- Resultado esperado: Error en envío vacío; diálogo cerrado al publicar válido y mismo artículo visible después del nuevo montaje.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2564.29 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APP-02 muestra el error de almacenamiento sin cerrar ni borrar el formulario

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Completar publicación y simular fallo de localStorage.setItem; enviar el formulario.
- Resultado esperado: Aviso No se pudo guardar y título conservado; formulario permanece abierto.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2049.99 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APP-03 filtra categorías completas y distingue la búsqueda vacía de los favoritos

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Seleccionar Herramientas; revisar artículos; buscar inexistente.
- Resultado esperado: Vernier visible, Arduino excluido y aviso No encontramos artículos, sin confundirlo con favoritos vacíos.
- Resultado obtenido: Vitest: passed; sin failureMessages; 315.51 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APP-04 guarda mensajes visibles en su conversación y los restaura al recargar

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Abrir artículo Arduino y conversación; enviar texto; desmontar, montar y abrir Mensajes.
- Resultado esperado: Mensaje visible en el log antes y después de recargar el componente.
- Resultado obtenido: Vitest: passed; sin failureMessages; 678.76 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APP-05 permite cerrar un modal con Escape y restaura el foco

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Abrir modal Publicar; comprobar foco en Título; pulsar Escape.
- Resultado esperado: Modal cerrado y foco devuelto al botón Publicar artículo.
- Resultado obtenido: Vitest: passed; sin failureMessages; 155.16 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APP-06 muestra errores de favoritos dentro del modal y conserva el estado

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Abrir detalle con favorito; simular fallo de guardado; pulsar Quitar de favoritos.
- Resultado esperado: Error dentro del modal; favorito mantiene aria-pressed=true.
- Resultado obtenido: Vitest: passed; sin failureMessages; 166.95 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APP-07 detecta datos dañados sin sobrescribirlos

- Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Guardar bad json bajo la clave local del repositorio y montar AppShell.
- Resultado esperado: Aviso No pudimos leer; dato dañado permanece sin sobrescribirse.
- Resultado obtenido: Vitest: passed; sin failureMessages; 3.47 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/App.test.jsx`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-01 recorta espacios y conserva importes decimales

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Validar título con espacios externos y precio 350.50.
- Resultado esperado: Título recortado e importe numérico 350.5.
- Resultado obtenido: Vitest: passed; sin failureMessages; 5.17 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-02 rechaza title inválido (        )

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.24 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-03 rechaza description inválido (                  )

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.53 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-04 rechaza location inválido ( )

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.54 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-05 rechaza price inválido ()

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.69 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-06 rechaza price inválido (-2)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.40 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-07 rechaza price inválido (0)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.25 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-08 rechaza price inválido (Infinity)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.19 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-09 rechaza price inválido (1.234)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.28 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-10 rechaza price inválido (1000001)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.34 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-11 rechaza category inválido (Otra)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.23 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-12 rechaza career inválido (Todas)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.14 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-13 rechaza condition inválido (Todas)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.12 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-14 rechaza modality inválido (Todos)

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.
- Resultado esperado: ValidationError; el contenido inválido no se acepta.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.13 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-15 normaliza donaciones e intercambios sin precio

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Validar donación e intercambio sin precio.
- Resultado esperado: price=0 y rentalPrice=0 en ambas modalidades.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.43 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-16 guarda la tarifa de renta en su campo correcto

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Validar renta con tarifa 350.50.
- Resultado esperado: price=0 y rentalPrice=350.5.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.22 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-17 rechaza SVG y URLs externas en las imágenes

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Validar imagen SVG como data URL y después URL externa.
- Resultado esperado: Ambas entradas generan ValidationError.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.43 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-18 encuentra palabras sin distinguir mayúsculas ni acentos

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Buscar CALCULO en fixtures con títulos acentuados.
- Resultado esperado: Se encuentra ct-004 sin distinguir acentos o mayúsculas.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.75 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-19 filtra la categoría completa y usa el precio diario para rentas

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Filtrar Herramientas entre 30 y 40 usando tarifas diarias.
- Resultado esperado: Solo ct-003, con tarifa de renta dentro del rango.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.33 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CATALOG-20 acumula filtros y excluye publicaciones finalizadas

- Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Combinar carrera Automotriz y Venta; repetir sobre publicación Finalizado.
- Resultado esperado: Sin coincidencias incompatibles y exclusión de finalizadas.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.31 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/domain/catalog.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APICLIENT-01 envía cookie y CSRF sin guardar la credencial en localStorage

- Módulo: Cliente HTTP. Requisito: RF-01 RF-04.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Recuperar sesión mediante fetch simulado; ejecutar favorito y revisar cookie/CSRF y localStorage.
- Resultado esperado: Petición incluye credentials=include y X-CSRF-Token; localStorage no guarda credenciales.
- Resultado obtenido: Vitest: passed; sin failureMessages; 11.04 ms. Fetch simulado; la integración real se evalúa por API y E2E.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/apiClient.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APICLIENT-02 rechaza respuestas HTML sin mostrarlas como contenido de la aplicación

- Módulo: Cliente HTTP. Requisito: RF-01 RF-04.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Simular respuesta HTML 503 del proxy y solicitar catálogo.
- Resultado esperado: Error INVALID_RESPONSE status=503; HTML no se muestra como contenido.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2.88 ms. Fetch simulado; la integración real se evalúa por API y E2E.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/apiClient.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-APICLIENT-03 mapea el catálogo de API a las tarjetas sin datos inventados

- Módulo: Cliente HTTP. Requisito: RF-01 RF-04.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Transformar artículo de renta y vendedor no verificado en tarjeta del catálogo.
- Resultado esperado: Modalidad Renta, tarifa 35, estado Disponible e iniciales AL; verified=false.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.10 ms. Fetch simulado; la integración real se evalúa por API y E2E.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/apiClient.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-01 conserva publicaciones y favoritos al crear una sesión nueva

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear publicación y favorito; crear otra instancia del repositorio y leer snapshot.
- Resultado esperado: Mismo ID/precio 350.5 y favorito conservados; vendedor sigue sin verificar.
- Resultado obtenido: Vitest: passed; sin failureMessages; 10.07 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-02 genera identificadores únicos incluso en el mismo milisegundo

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear dos publicaciones consecutivas en el mismo ciclo de ejecución.
- Resultado esperado: Sus identificadores son distintos.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.97 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-03 no permite modificar publicaciones de demostración ajenas

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Intentar editar y finalizar la publicación ajena ct-001.
- Resultado esperado: Ambas acciones lanzan error de propiedad.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2.30 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-04 edita, reserva y finaliza una publicación propia sin reabrirla

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear artículo propio; editar título; reservar; finalizar; intentar reabrir y editar.
- Resultado esperado: Edición/reserva correctas; estado final irreversible y edición posterior rechazada.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2.31 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-05 no muta el estado cuando una entrada es inválida

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Intentar crear publicación con título en blanco sobre almacenamiento vacío.
- Resultado esperado: Error de validación y localStorage permanece sin documento.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.87 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-06 propaga el perfil a sus publicaciones sin inventar verificación

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear artículo; editar perfil con nombre Ana López, carrera y semestre; consultar snapshot.
- Resultado esperado: Perfil e iniciales AL propagados a la publicación; verified=false.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.42 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-07 no sobrescribe datos dañados silenciosamente

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Guardar JSON roto; intentar leer y crear artículo.
- Resultado esperado: StorageError en ambos accesos; contenido roto se conserva.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.78 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-08 detecta un documento JSON válido con estructura incompatible

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear documento válido; eliminar modality; guardar y volver a consultar.
- Resultado esperado: Estructura incompatible detectada con StorageError.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.67 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-09 informa de falta de espacio y conserva el estado anterior

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear estado previo; simular QuotaExceededError; intentar otra creación.
- Resultado esperado: Mensaje No se pudo guardar y estado anterior idéntico.
- Resultado obtenido: Vitest: passed; sin failureMessages; 3.56 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-10 lee los cambios guardados desde otra instancia antes de escribir

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear dos instancias; escribir artículo desde una y favorito ct-002 desde otra; leer de nuevo.
- Resultado esperado: Siete artículos en snapshot y escritura basada en el estado actualizado.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.71 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-11 reutiliza conversaciones y mantiene sus mensajes separados

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Abrir dos conversaciones de artículos distintos, repetir una y enviar texto con espacios a la primera; recargar repositorio.
- Resultado esperado: Solo dos conversaciones; texto recortado en la primera y segunda vacía.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.56 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-12 rechaza mensajes vacíos y conversaciones inexistentes

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Enviar texto vacío y después texto válido a conversación inexistente.
- Resultado esperado: Errores Escribe un mensaje y Selecciona una conversación respectivamente.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.51 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-13 impide abrir una conversación con una publicación propia

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Crear artículo propio e intentar abrir su conversación.
- Resultado esperado: Error que impide conversar con la propia publicación.
- Resultado obtenido: Vitest: passed; sin failureMessages; 0.86 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-CAMPUSREPOSITORY-14 registra reportes válidos y evita duplicados abiertos

- Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Reportar artículo válido; repetir reporte abierto; reportar otro sin detalle.
- Resultado esperado: Primer reporte Abierto persistido; duplicado y detalle vacío rechazados.
- Resultado obtenido: Vitest: passed; sin failureMessages; 1.46 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/campusRepository.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-LISTINGIMAGE-01 rechaza archivos que solo declaran ser imágenes

- Módulo: Regresión de imágenes locales. Requisito: RF-04.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Enviar bytes que declaran ser PNG sin firma válida.
- Resultado esperado: Promesa rechazada por contenido no válido.
- Resultado obtenido: Vitest: passed; sin failureMessages; 7.56 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/listingImage.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-LISTINGIMAGE-02 rechaza formatos no permitidos y archivos grandes

- Módulo: Regresión de imágenes locales. Requisito: RF-04.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Enviar SVG y archivo por encima del límite permitido.
- Resultado esperado: Formatos y tamaño indebidos rechazados.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2.11 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/listingImage.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## FE-LISTINGIMAGE-03 lee una firma PNG compatible como data URL

- Módulo: Regresión de imágenes locales. Requisito: RF-04.
- Entorno y actor: Windows Node 24 Vitest jsdom; Interacción automatizada con fixtures; no participante humano.
- Procedimiento: Leer fixture PNG válido con firma compatible.
- Resultado esperado: Data URL PNG válido devuelto.
- Resultado obtenido: Vitest: passed; sin failureMessages; 2.39 ms. Prueba del modo de demostración, sin atribuir persistencia de servidor.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:05:33-06:00.
- Fuente: `frontend/src/services/listingImage.test.js`. Evidencia: [evidencias/frontend.json](evidencias/frontend.json).

## E2E-DESKTOP-01 registro verificación publicación con imagen y edición persistentes

- Módulo: Recorrido desktop. Requisito: RF-01 RF-02 RF-03 RF-04 RF-08.
- Entorno y actor: CI Chromium Desktop Chrome; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear cuenta sintética por UI; obtener enlace del transporte aislado; verificar e iniciar sesión; publicar imagen y recargar; editar título y comprobar consola/ancho.
- Resultado esperado: Cuenta creada; diálogo de verificación se cierra; publicación y título editado persisten; sin pageerror ni desbordamiento.
- Resultado obtenido: Playwright aprobó el caso sin error en desktop; duración 2.6s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:44-06:00.
- Fuente: `frontend/e2e/fullstack.spec.js:21`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-DESKTOP-02 catálogo y favoritos persisten entre sesiones del navegador

- Módulo: Recorrido desktop. Requisito: RF-06 RF-07 RF-10.
- Entorno y actor: CI Chromium Desktop Chrome; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear vendedor y comprador aislados; buscar artículo; agregar favorito; recargar; salir y volver a iniciar sesión.
- Resultado esperado: Artículo buscado visible y favorito conservado después de recarga y nuevo login.
- Resultado obtenido: Playwright aprobó el caso sin error en desktop; duración 2.3s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:44-06:00.
- Fuente: `frontend/e2e/fullstack.spec.js:114`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-DESKTOP-03 una cuenta sin verificar no publica ni obtiene una insignia falsa

- Módulo: Recorrido desktop. Requisito: RF-02 RF-04.
- Entorno y actor: CI Chromium Desktop Chrome; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear cuenta sintética sin verificar; iniciar sesión y pulsar Publicar artículo.
- Resultado esperado: Aviso de verificación pendiente y error Verifica tu correo institucional; no se abre formulario.
- Resultado obtenido: Playwright aprobó el caso sin error en desktop; duración 886ms.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:45-06:00.
- Fuente: `frontend/e2e/fullstack.spec.js:157`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-DESKTOP-04 mensajes entre dos sesiones y venta con calificación

- Módulo: Recorrido desktop. Requisito: RF-05 RF-09 RF-11 RF-13.
- Entorno y actor: CI Chromium Desktop Chrome; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Abrir dos contextos; comprador y vendedor intercambian mensajes sobre biblioteca; solicitar, aceptar y finalizar venta; calificar.
- Resultado esperado: Ambas sesiones reciben mensajes; operación finalizada; calificación guardada y reputación 5; sin desbordamiento.
- Resultado obtenido: Playwright aprobó el caso sin error en desktop; duración 12.6s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:57-06:00.
- Fuente: `frontend/e2e/workflows.spec.js:27`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-DESKTOP-05 reporte y resolución real desde la administración

- Módulo: Recorrido desktop. Requisito: RF-12 RF-14.
- Entorno y actor: CI Chromium Desktop Chrome; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear reporte como estudiante; entrar como admin del esquema de pruebas; resolverlo; volver al perfil del reportante.
- Resultado esperado: Reporte guardado; resolución persistida y visible para administrador y reportante.
- Resultado obtenido: Playwright aprobó el caso sin error en desktop; duración 2.8s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:48-06:00.
- Fuente: `frontend/e2e/workflows.spec.js:130`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-MOBILE-01 registro verificación publicación con imagen y edición persistentes

- Módulo: Recorrido mobile. Requisito: RF-01 RF-02 RF-03 RF-04 RF-08.
- Entorno y actor: CI Chromium Pixel 7; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear cuenta sintética por UI; obtener enlace del transporte aislado; verificar e iniciar sesión; publicar imagen y recargar; editar título y comprobar consola/ancho.
- Resultado esperado: Cuenta creada; diálogo de verificación se cierra; publicación y título editado persisten; sin pageerror ni desbordamiento.
- Resultado obtenido: Playwright aprobó el caso sin error en mobile; duración 1.7s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:50-06:00.
- Fuente: `frontend/e2e/fullstack.spec.js:21`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-MOBILE-02 catálogo y favoritos persisten entre sesiones del navegador

- Módulo: Recorrido mobile. Requisito: RF-06 RF-07 RF-10.
- Entorno y actor: CI Chromium Pixel 7; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear vendedor y comprador aislados; buscar artículo; agregar favorito; recargar; salir y volver a iniciar sesión.
- Resultado esperado: Artículo buscado visible y favorito conservado después de recarga y nuevo login.
- Resultado obtenido: Playwright aprobó el caso sin error en mobile; duración 1.2s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:51-06:00.
- Fuente: `frontend/e2e/fullstack.spec.js:114`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-MOBILE-03 una cuenta sin verificar no publica ni obtiene una insignia falsa

- Módulo: Recorrido mobile. Requisito: RF-02 RF-04.
- Entorno y actor: CI Chromium Pixel 7; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear cuenta sintética sin verificar; iniciar sesión y pulsar Publicar artículo.
- Resultado esperado: Aviso de verificación pendiente y error Verifica tu correo institucional; no se abre formulario.
- Resultado obtenido: Playwright aprobó el caso sin error en mobile; duración 799ms.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:52-06:00.
- Fuente: `frontend/e2e/fullstack.spec.js:157`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-MOBILE-04 mensajes entre dos sesiones y venta con calificación

- Módulo: Recorrido mobile. Requisito: RF-05 RF-09 RF-11 RF-13.
- Entorno y actor: CI Chromium Pixel 7; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Abrir dos contextos; comprador y vendedor intercambian mensajes sobre biblioteca; solicitar, aceptar y finalizar venta; calificar.
- Resultado esperado: Ambas sesiones reciben mensajes; operación finalizada; calificación guardada y reputación 5; sin desbordamiento.
- Resultado obtenido: Playwright aprobó el caso sin error en mobile; duración 12.6s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:09:04-06:00.
- Fuente: `frontend/e2e/workflows.spec.js:27`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## E2E-MOBILE-05 reporte y resolución real desde la administración

- Módulo: Recorrido mobile. Requisito: RF-12 RF-14.
- Entorno y actor: CI Chromium Pixel 7; Roles sintéticos estudiante, comprador, vendedor y administrador; sin correos reales.
- Procedimiento: Crear reporte como estudiante; entrar como admin del esquema de pruebas; resolverlo; volver al perfil del reportante.
- Resultado esperado: Reporte guardado; resolución persistida y visible para administrador y reportante.
- Resultado obtenido: Playwright aprobó el caso sin error en mobile; duración 2.7s.
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:09:00-06:00.
- Fuente: `frontend/e2e/workflows.spec.js:130`. Evidencia: [evidencias/navegador-ci.log](evidencias/navegador-ci.log).

## PUB-01 GET /

- Módulo: Frontend. Requisito: Infraestructura y permisos.
- Entorno y actor: https://campustrade-mex-per.onrender.com; Sonda automática anónima de solo lectura.
- Procedimiento: Abrir conexión HTTPS al origen público y ejecutar GET /. Comprobar estado y contenido esperado.
- Resultado esperado: HTTP 200; HTML de CampusTrade.
- Resultado obtenido: HTTP 200; HTML raíz presente
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:32-06:00.
- Fuente: `backend/src/app.js`. Evidencia: [evidencias/produccion-lectura.json](evidencias/produccion-lectura.json).

## PUB-02 GET /api/v1/health

- Módulo: Base de datos. Requisito: Infraestructura y permisos.
- Entorno y actor: https://campustrade-mex-per.onrender.com; Sonda automática anónima de solo lectura.
- Procedimiento: Abrir conexión HTTPS al origen público y ejecutar GET /api/v1/health. Comprobar estado y contenido esperado.
- Resultado esperado: HTTP 200; status=ok y database=connected.
- Resultado obtenido: HTTP 200; status=ok, database=connected, version=0.3.0
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:32-06:00.
- Fuente: `backend/src/app.js`. Evidencia: [evidencias/produccion-lectura.json](evidencias/produccion-lectura.json).

## PUB-03 GET /api/v1/catalog

- Módulo: Catálogo institucional. Requisito: Infraestructura y permisos.
- Entorno y actor: https://campustrade-mex-per.onrender.com; Sonda automática anónima de solo lectura.
- Procedimiento: Abrir conexión HTTPS al origen público y ejecutar GET /api/v1/catalog. Comprobar estado y contenido esperado.
- Resultado esperado: HTTP 200; emailDomains exactamente itesa.edu.mx.
- Resultado obtenido: HTTP 200; dominios=["itesa.edu.mx"]
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:32-06:00.
- Fuente: `backend/src/app.js`. Evidencia: [evidencias/produccion-lectura.json](evidencias/produccion-lectura.json).

## PUB-04 GET /api/v1/listings

- Módulo: Catálogo de artículos. Requisito: Infraestructura y permisos.
- Entorno y actor: https://campustrade-mex-per.onrender.com; Sonda automática anónima de solo lectura.
- Procedimiento: Abrir conexión HTTPS al origen público y ejecutar GET /api/v1/listings. Comprobar estado y contenido esperado.
- Resultado esperado: HTTP 200; Listado paginado de la API.
- Resultado obtenido: HTTP 200; items=0
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:32-06:00.
- Fuente: `backend/src/app.js`. Evidencia: [evidencias/produccion-lectura.json](evidencias/produccion-lectura.json).

## PUB-05 GET /api/v1/me/favorites

- Módulo: Autorización. Requisito: Infraestructura y permisos.
- Entorno y actor: https://campustrade-mex-per.onrender.com; Sonda automática anónima de solo lectura.
- Procedimiento: Abrir conexión HTTPS al origen público y ejecutar GET /api/v1/me/favorites. Comprobar estado y contenido esperado.
- Resultado esperado: HTTP 401; Sin sesión no accede a favoritos.
- Resultado obtenido: HTTP 401
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:32-06:00.
- Fuente: `backend/src/app.js`. Evidencia: [evidencias/produccion-lectura.json](evidencias/produccion-lectura.json).

## PUB-06 GET /api/v1/auth/session

- Módulo: Sesión pública. Requisito: Infraestructura y permisos.
- Entorno y actor: https://campustrade-mex-per.onrender.com; Sonda automática anónima de solo lectura.
- Procedimiento: Abrir conexión HTTPS al origen público y ejecutar GET /api/v1/auth/session. Comprobar estado y contenido esperado.
- Resultado esperado: HTTP 200; Sin usuario y correo sin proveedor.
- Resultado obtenido: HTTP 200; user=null, emailDeliveryConfigured=false
- Estado: **APROBADA**. Ejecución: 2026-11-07T19:08:33-06:00.
- Fuente: `backend/src/app.js`. Evidencia: [evidencias/produccion-lectura.json](evidencias/produccion-lectura.json).
