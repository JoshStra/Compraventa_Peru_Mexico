# 1 Casos de prueba ejecutados

Se ejecutaron 101 casos técnicos distintos y su resultado final fue APROBADA en todos: 47 frontend, 34 API y configuración, 12 recorridos de navegador y 8 comprobaciones HTTPS productivas. Los recorridos nuevos E2E-DESKTOP-06 y E2E-MOBILE-06 comprueban el recorte de filtros y el reinicio de criterios; el móvil utiliza 320 por 760 px.

Cada ficha del anexo y de los catálogos CSV/JSON identifica ID, título, módulo, requisito, procedimiento, esperado, obtenido, estado, fecha, entorno, código y evidencia. La fecha de API es el fin de la suite; la de frontend es el fin del archivo; Playwright registra el inicio individual. No se presentan esos tiempos de lote como instantes de cada clic.

Los casos de regresión del prototipo explícito utilizan JSDOM o repositorio local. No se presentan como pruebas del backend productivo. Los recorridos E2E sí utilizan la interfaz conectada, PostgreSQL real local y transporte de correo aislado con cuentas campus.test. Las ocho sondas productivas son lecturas anónimas HTTPS.

La sesión exploratoria de Codex contiene ocho tareas y nueve registros por la repetición de COD-08. Se documenta aparte en el apartado 8 y no se suma a los 101 casos técnicos.

## Catálogo íntegro

El PDF incluye las 101 fichas en el anexo de casos. Los archivos casos_ejecutados.csv y casos_ejecutados.json conservan todos los campos y facilitan filtrar por módulo, requisito y resultado.

## API-AUTH-01 registro institucional almacena hash y nunca inventa la verificación

Módulo: Cuentas y sesiones. Requisito: RF-01 RF-02. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Registrar fixture institucional; consultar campos devueltos y hashes almacenados.

Esperado: HTTP 201; verified=false; hash Argon2 y matrícula HMAC, sin hashes en respuesta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: HTTP 201; verified=false; hash Argon2 y matrícula HMAC, sin hashes en respuesta. Duración del caso 314.19 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/auth.test.js:16.

## API-AUTH-02 rechaza dominios ajenos, contraseñas cortas, roles y duplicados

Módulo: Cuentas y sesiones. Requisito: RF-01 RF-02. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Enviar dominio con sufijo ajeno, contraseña corta y role=admin; repetir cuenta válida.

Esperado: HTTP 400 para entradas o rol indebidos y 409 para cuenta duplicada.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: HTTP 400 para entradas o rol indebidos y 409 para cuenta duplicada. Duración del caso 79.97 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/auth.test.js:31.

## API-AUTH-03 el enlace de verificación es de un solo uso

Módulo: Cuentas y sesiones. Requisito: RF-02. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Consumir dos veces el token de verificación del transporte aislado.

Esperado: Primera petición 200 y segunda 400; token de un solo uso.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Primera petición 200 y segunda 400; token de un solo uso. Duración del caso 121.90 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/auth.test.js:53.

## API-AUTH-04 sesión HttpOnly, CSRF, persistencia y cierre revocable

Módulo: Cuentas y sesiones. Requisito: RF-01. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Iniciar sesión; consultar sesión; intentar logout sin CSRF; cerrar con CSRF y volver a consultar.

Esperado: Cookie HttpOnly; sin CSRF 403; cierre válido 200; sesión final null.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Cookie HttpOnly; sin CSRF 403; cierre válido 200; sesión final null. Duración del caso 88.75 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/auth.test.js:61.

## API-AUTH-05 recuperación cambia la contraseña y revoca las sesiones previas

Módulo: Cuentas y sesiones. Requisito: RF-01. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Solicitar token de recuperación; confirmar contraseña nueva; reutilizar sesión anterior e intentar clave anterior.

Esperado: Confirmación 200; sesión anterior revocada; clave anterior devuelve 401.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Confirmación 200; sesión anterior revocada; clave anterior devuelve 401. Duración del caso 316.68 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/auth.test.js:96.

## API-AUTH-06 rechaza orígenes extraños y tokens vencidos

Módulo: Cuentas y sesiones. Requisito: RF-01 RF-02. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Enviar login desde origen ajeno; caducar token en la base de pruebas e intentar verificar.

Esperado: Origen ajeno 403; token vencido 400.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Origen ajeno 403; token vencido 400. Duración del caso 134.68 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/auth.test.js:130.

## API-CONFIG-01 Render proporciona el origen HTTPS inicial sin adivinar el dominio asignado

Módulo: Configuración de producción. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Cargar configuración productiva con RENDER_EXTERNAL_URL y S3 configurado, sin PUBLIC_URL.

Esperado: Origen HTTPS asignado y dominio itesa.edu.mx detectados exactamente.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Origen HTTPS asignado y dominio itesa.edu.mx detectados exactamente. Duración del caso 1.06 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/config.test.js:17.

## API-CONFIG-02 PUBLIC_URL y CORS_ORIGINS explícitos prevalecen sobre el dominio de Render

Módulo: Configuración de producción. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Definir PUBLIC_URL y CORS_ORIGINS junto con un dominio distinto de Render.

Esperado: La configuración explícita prevalece y conserva los orígenes especificados.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: La configuración explícita prevalece y conserva los orígenes especificados. Duración del caso 0.16 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/config.test.js:26.

## API-CONFIG-03 la detección de Render no permite HTTP ni orígenes con rutas

Módulo: Configuración de producción. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Probar origen HTTP y origen HTTPS con ruta en configuración productiva.

Esperado: Ambas configuraciones generan error, sin permitir origen inseguro o con ruta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Ambas configuraciones generan error, sin permitir origen inseguro o con ruta. Duración del caso 0.91 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/config.test.js:39.

## API-CONFIG-04 producción sigue rechazando URL ausente y almacenamiento local

Módulo: Configuración de producción. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Cargar producción sin URL; repetir con URL HTTPS y almacenamiento local.

Esperado: Arranque rechazado por HTTPS ausente o por requerir S3 persistente.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Arranque rechazado por HTTPS ausente o por requerir S3 persistente. Duración del caso 0.20 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/config.test.js:57.

## API-CONVERSATIONS-01 conversación única entre participantes distintos

Módulo: Mensajes privados. Requisito: RF-09. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Intentar conversar sobre artículo propio; abrir dos veces como comprador.

Esperado: Artículo propio 400; conversación válida 201; reapertura conserva el mismo ID.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Artículo propio 400; conversación válida 201; reapertura conserva el mismo ID. Duración del caso 491.97 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/conversations.test.js:14.

## API-CONVERSATIONS-02 mensaje del comprador llega al vendedor y persiste

Módulo: Mensajes privados. Requisito: RF-09 RF-13. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Enviar mensaje con espacios; consultarlo desde vendedor y desde la base.

Esperado: Mensaje 201, texto recortado, mismo contenido para vendedor y una fila persistida.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Mensaje 201, texto recortado, mismo contenido para vendedor y una fila persistida. Duración del caso 25.65 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/conversations.test.js:31.

## API-CONVERSATIONS-03 bloquea lectura escritura y suplantación por terceros

Módulo: Mensajes privados. Requisito: RF-09. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Un tercero intenta leer y enviar; participante manda texto vacío, NUL y senderId ajeno.

Esperado: Tercero 403; texto inválido y suplantación 400.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Tercero 403; texto inválido y suplantación 400. Duración del caso 23.24 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/conversations.test.js:51.

## API-DATABASE-01 migraciones PostgreSQL idempotentes y catálogo inicial

Módulo: PostgreSQL y migraciones. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Aplicar migraciones dos veces sobre base de pruebas; contar migraciones y consultar catálogo.

Esperado: Dos migraciones registradas; catálogo HTTP 200 con cuatro categorías iniciales.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Dos migraciones registradas; catálogo HTTP 200 con cuatro categorías iniciales. Duración del caso 70.96 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/database.test.js:12.

## API-DATABASE-02 health confirma la conexión real y no expone secretos

Módulo: PostgreSQL y migraciones. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Consultar GET /api/v1/health sobre aplicación conectada a PostgreSQL.

Esperado: HTTP 200, database=connected y ausencia de cabecera x-powered-by.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: HTTP 200, database=connected y ausencia de cabecera x-powered-by. Duración del caso 12.75 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/database.test.js:26.

## API-DATABASE-03 rollback conserva la integridad cuando falla una escritura

Módulo: PostgreSQL y migraciones. Requisito: Infraestructura. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Insertar categoría dentro de transacción; provocar excepción; consultar el nombre insertado.

Esperado: Rollback deja cero categorías con ese nombre.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Rollback deja cero categorías con ese nombre. Duración del caso 7.05 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/database.test.js:34.

## API-LISTINGS-01 publicar exige sesión y correo verificado; no acepta suplantar propietario

Módulo: Publicaciones e imágenes. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Publicar sin sesión, sin verificar y con sellerId ajeno; publicar fixture válido del propietario.

Esperado: 401, 403 y 400 respectivamente; publicación válida 201 con propietario de sesión.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: 401, 403 y 400 respectivamente; publicación válida 201 con propietario de sesión. Duración del caso 457.41 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/listings.test.js:28.

## API-LISTINGS-02 contenido inválido se rechaza y las consultas están parametrizadas

Módulo: Publicaciones e imágenes. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Enviar título/descripción vacíos y precios inválidos; buscar con filtros; enviar texto de inyección y límite 100.

Esperado: Entradas inválidas 400; búsqueda correcta 200; inyección sin efecto, cero resultados; límite 100 rechazado.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Entradas inválidas 400; búsqueda correcta 200; inyección sin efecto, cero resultados; límite 100 rechazado. Duración del caso 32.34 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/listings.test.js:53.

## API-LISTINGS-03 solo el propietario edita y retira; persiste con una nueva instancia de API

Módulo: Publicaciones e imágenes. Requisito: RF-03 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Tercero intenta editar/retirar; propietario cambia título; crear otra instancia de API y consultar.

Esperado: Tercero 403; edición 200 y título conservado en la nueva instancia.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Tercero 403; edición 200 y título conservado en la nueva instancia. Duración del caso 28.54 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/listings.test.js:83.

## API-LISTINGS-04 favoritos idempotentes se conservan en PostgreSQL

Módulo: Publicaciones e imágenes. Requisito: RF-10. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Agregar favorito dos veces; consultar desde dos cuentas; retirarlo y consultar de nuevo.

Esperado: Una sola referencia propia, no visible como favorito ajeno; después cero favoritos.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Una sola referencia propia, no visible como favorito ajeno; después cero favoritos. Duración del caso 53.55 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/listings.test.js:108.

## API-LISTINGS-05 la carga verifica MIME contenido extensión y tamaño antes de publicar

Módulo: Publicaciones e imágenes. Requisito: RF-04 RF-08. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Subir sin verificar, SVG declarado PNG, archivo mayor de 5 MB y extensión incompatible; subir PNG válido y asociarlo al artículo.

Esperado: 403/400/413/400; PNG válido 201 y lectura pública WebP 200 solo tras asociarlo; imagen ajena 403.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: 403/400/413/400; PNG válido 201 y lectura pública WebP 200 solo tras asociarlo; imagen ajena 403. Duración del caso 114.82 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/listings.test.js:121.

## API-LISTINGS-06 retirar conserva historial y excluye el artículo del catálogo

Módulo: Publicaciones e imágenes. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Retirar publicación propia; consultar detalle y fila persistida.

Esperado: Retiro 200; detalle 404 y deleted_at conservado sin borrar historial.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Retiro 200; detalle 404 y deleted_at conservado sin borrar historial. Duración del caso 13.25 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/listings.test.js:190.

## API-MODERATION-01 reporte persistente evita duplicados y limita acceso administrativo

Módulo: Reportes y administración. Requisito: RF-12 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Crear reporte, repetirlo y consultar como reportante/otro; intentar panel como estudiante.

Esperado: 201, duplicado 409, reporte visible solo al propio, panel 403.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: 201, duplicado 409, reporte visible solo al propio, panel 403. Duración del caso 659.62 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/moderation.test.js:18.

## API-MODERATION-02 administrador revisa resuelve y registra una decisión real

Módulo: Reportes y administración. Requisito: RF-12 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Consultar panel admin; resolver reporte; leer resolución como reportante; intentar reabrir.

Esperado: Panel/resolución 200; estado resolved persistente; reapertura 409; sin hash expuesto.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Panel/resolución 200; estado resolved persistente; reapertura 409; sin hash expuesto. Duración del caso 39.82 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/moderation.test.js:40.

## API-MODERATION-03 moderación retira contenido sin borrar su historial

Módulo: Reportes y administración. Requisito: RF-04 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Estudiante intenta retirar por ruta administrativa; repetir como admin y consultar detalle/base.

Esperado: Estudiante 403; admin 200; detalle 404 y registro histórico conservado.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Estudiante 403; admin 200; detalle 404 y registro histórico conservado. Duración del caso 20.70 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/moderation.test.js:65.

## API-MODERATION-04 suspensión revoca sesiones y oculta publicaciones; no modifica administradores

Módulo: Reportes y administración. Requisito: RF-01 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Suspender vendedor y consultar sesión/catálogo; intentar suspender al mismo administrador.

Esperado: Suspensión 200; sesión null; catálogo sin publicaciones del suspendido; administrador protegido con 400.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Suspensión 200; sesión null; catálogo sin publicaciones del suspendido; administrador protegido con 400. Duración del caso 55.22 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/moderation.test.js:86.

## API-MODERATION-05 categorías y carreras se administran sin modificar referencias históricas

Módulo: Reportes y administración. Requisito: RF-07 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Crear/desactivar categoría y crear carrera; consultar catálogo.

Esperado: Altas 201, desactivación 200, carrera disponible y referencias históricas conservadas.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Altas 201, desactivación 200, carrera disponible y referencias históricas conservadas. Duración del caso 24.70 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/moderation.test.js:112.

## API-OPERATIONS-01 dos aceptaciones simultáneas solo reservan el artículo una vez

Módulo: Operaciones y calificaciones. Requisito: RF-05. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Crear dos solicitudes para un artículo; aceptar ambas concurrentemente; consultar reserva en base y catálogo.

Esperado: Respuestas 200 y 409; exactamente una reserva aceptada; artículo reserved.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Respuestas 200 y 409; exactamente una reserva aceptada; artículo reserved. Duración del caso 496.28 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/operations.test.js:15.

## API-OPERATIONS-02 estados terminales bloquean solicitudes y las calificaciones exigen finalización

Módulo: Operaciones y calificaciones. Requisito: RF-05 RF-11. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Calificar antes de finalizar y finalizar como comprador; finalizar como propietario; repetir solicitud y calificación.

Esperado: 409 y 403 anticipados; finalización 200; nueva solicitud 409; primera calificación 201 y duplicada 409; reputación 5.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: 409 y 403 anticipados; finalización 200; nueva solicitud 409; primera calificación 201 y duplicada 409; reputación 5. Duración del caso 54.97 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/operations.test.js:48.

## API-OPERATIONS-03 cancelar una reserva libera disponibilidad y rechaza terceros

Módulo: Operaciones y calificaciones. Requisito: RF-05. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Aceptar reserva; intentar cancelar como tercero; cancelar como solicitante y consultar artículo.

Esperado: Tercero 403; cancelación legítima 200; artículo vuelve a available.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Tercero 403; cancelación legítima 200; artículo vuelve a available. Duración del caso 58.27 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/operations.test.js:109.

## API-OPERATIONS-04 renta valida fechas e importe y permite registrar devolución

Módulo: Operaciones y calificaciones. Requisito: RF-05. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Solicitar renta sin fechas y con tres días a 35; consultar fechas/importe; aceptar, finalizar y registrar devolución.

Esperado: Sin fechas 400; renta 201; fechas YYYY-MM-DD, importe 105; estado rented y después available.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Sin fechas 400; renta 201; fechas YYYY-MM-DD, importe 105; estado rented y después available. Duración del caso 80.79 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/operations.test.js:141.

## API-OPERATIONS-05 intercambio reserva ambos artículos y no permite reutilizar el ofrecido

Módulo: Operaciones y calificaciones. Requisito: RF-05. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Ofrecer el mismo artículo en dos intercambios; aceptar simultáneamente desde sus propietarios.

Esperado: Solo una aceptación 200, otra 409; artículo ofrecido reserved y no reutilizado.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Solo una aceptación 200, otra 409; artículo ofrecido reserved y no reutilizado. Duración del caso 82.24 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/operations.test.js:192.

## API-OPERATIONS-06 retirar una oferta de intercambio cancela las solicitudes pendientes relacionadas

Módulo: Operaciones y calificaciones. Requisito: RF-04 RF-05. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Solicitar intercambio con artículo propio ofrecido; retirar la oferta; consultar operaciones.

Esperado: Creación 201, retiro 200 y solicitud relacionada cancelled, nunca pending.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Creación 201, retiro 200 y solicitud relacionada cancelled, nunca pending. Duración del caso 50.21 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/operations.test.js:231.

## API-PERSISTENCE-01 publicación y sesión sobreviven al reinicio real del proceso Node

Módulo: Persistencia entre procesos. Requisito: RF-01 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:17:33-06:00. Precisión: Fin de suite API, no instante individual.

Procedimiento: Iniciar proceso Node, login y publicación; detenerlo; iniciar PID distinto y consultar artículo con la cookie anterior.

Esperado: PID distinto; título/precio 123.45 e identidad de sesión conservados en PostgreSQL.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: PID distinto; título/precio 123.45 e identidad de sesión conservados en PostgreSQL. Duración del caso 1976.28 ms.

Entorno: Windows Node 24 PostgreSQL 17 local, esquema aislado. Evidencia: evidencias/api.xml. Fuente: backend/test/persistence.test.js:8.

## FE-APP-01 publica sin errores de evento asíncrono y conserva el artículo al recargar

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Abrir Publicar y enviar vacío; completar campos; publicar; desmontar y volver a montar AppShell.

Esperado: Error en envío vacío; diálogo cerrado al publicar válido y mismo artículo visible después del nuevo montaje.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Error en envío vacío; diálogo cerrado al publicar válido y mismo artículo visible después del nuevo montaje. Duración del caso 2121.95 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:23.

## FE-APP-02 muestra el error de almacenamiento sin cerrar ni borrar el formulario

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Completar publicación y simular fallo de localStorage.setItem; enviar el formulario.

Esperado: Aviso No se pudo guardar y título conservado; formulario permanece abierto.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Aviso No se pudo guardar y título conservado; formulario permanece abierto. Duración del caso 2030.43 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:56.

## FE-APP-03 filtra categorías completas y distingue la búsqueda vacía de los favoritos

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Seleccionar Herramientas; revisar artículos; buscar inexistente.

Esperado: Vernier visible, Arduino excluido y aviso No encontramos artículos, sin confundirlo con favoritos vacíos.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Vernier visible, Arduino excluido y aviso No encontramos artículos, sin confundirlo con favoritos vacíos. Duración del caso 323.12 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:75.

## FE-APP-04 guarda mensajes visibles en su conversación y los restaura al recargar

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Abrir artículo Arduino y conversación; enviar texto; desmontar, montar y abrir Mensajes.

Esperado: Mensaje visible en el log antes y después de recargar el componente.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Mensaje visible en el log antes y después de recargar el componente. Duración del caso 692.79 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:100.

## FE-APP-05 permite cerrar un modal con Escape y restaura el foco

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Abrir modal Publicar; comprobar foco en Título; pulsar Escape.

Esperado: Modal cerrado y foco devuelto al botón Publicar artículo.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Modal cerrado y foco devuelto al botón Publicar artículo. Duración del caso 122.17 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:132.

## FE-APP-06 muestra errores de favoritos dentro del modal y conserva el estado

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Abrir detalle con favorito; simular fallo de guardado; pulsar Quitar de favoritos.

Esperado: Error dentro del modal; favorito mantiene aria-pressed=true.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Error dentro del modal; favorito mantiene aria-pressed=true. Duración del caso 166.63 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:143.

## FE-APP-07 detecta datos dañados sin sobrescribirlos

Módulo: Regresión de interfaz local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:11-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Guardar bad json bajo la clave local del repositorio y montar AppShell.

Esperado: Aviso No pudimos leer; dato dañado permanece sin sobrescribirse.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Aviso No pudimos leer; dato dañado permanece sin sobrescribirse. Duración del caso 4.57 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/App.test.jsx:165.

## FE-CATALOG-01 recorta espacios y conserva importes decimales

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Validar título con espacios externos y precio 350.50.

Esperado: Título recortado e importe numérico 350.5.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Título recortado e importe numérico 350.5. Duración del caso 2.90 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:22.

## FE-CATALOG-02 rechaza title inválido (        )

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.65 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-03 rechaza description inválido (                  )

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.28 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-04 rechaza location inválido ( )

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.25 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-05 rechaza price inválido ()

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.17 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-06 rechaza price inválido (-2)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.17 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-07 rechaza price inválido (0)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.17 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-08 rechaza price inválido (Infinity)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.15 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-09 rechaza price inválido (1.234)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.18 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-10 rechaza price inválido (1000001)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.23 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-11 rechaza category inválido (Otra)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.19 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-12 rechaza career inválido (Todas)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.12 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-13 rechaza condition inválido (Todas)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.09 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-14 rechaza modality inválido (Todos)

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Partir de artículo válido; sustituir el campo y valor indicados en el nombre del caso; ejecutar validateListing.

Esperado: ValidationError; el contenido inválido no se acepta.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: ValidationError; el contenido inválido no se acepta. Duración del caso 0.07 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js.

## FE-CATALOG-15 normaliza donaciones e intercambios sin precio

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Validar donación e intercambio sin precio.

Esperado: price=0 y rentalPrice=0 en ambas modalidades.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: price=0 y rentalPrice=0 en ambas modalidades. Duración del caso 0.31 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:46.

## FE-CATALOG-16 guarda la tarifa de renta en su campo correcto

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Validar renta con tarifa 350.50.

Esperado: price=0 y rentalPrice=350.5.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: price=0 y rentalPrice=350.5. Duración del caso 0.18 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:52.

## FE-CATALOG-17 rechaza SVG y URLs externas en las imágenes

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Validar imagen SVG como data URL y después URL externa.

Esperado: Ambas entradas generan ValidationError.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Ambas entradas generan ValidationError. Duración del caso 0.27 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:57.

## FE-CATALOG-18 encuentra palabras sin distinguir mayúsculas ni acentos

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Buscar CALCULO en fixtures con títulos acentuados.

Esperado: Se encuentra ct-004 sin distinguir acentos o mayúsculas.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Se encuentra ct-004 sin distinguir acentos o mayúsculas. Duración del caso 0.37 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:78.

## FE-CATALOG-19 filtra la categoría completa y usa el precio diario para rentas

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Filtrar Herramientas entre 30 y 40 usando tarifas diarias.

Esperado: Solo ct-003, con tarifa de renta dentro del rango.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Solo ct-003, con tarifa de renta dentro del rango. Duración del caso 0.23 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:85.

## FE-CATALOG-20 acumula filtros y excluye publicaciones finalizadas

Módulo: Regresión del catálogo local. Requisito: RF-04 RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Combinar carrera Automotriz y Venta; repetir sobre publicación Finalizado.

Esperado: Sin coincidencias incompatibles y exclusión de finalizadas.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Sin coincidencias incompatibles y exclusión de finalizadas. Duración del caso 0.22 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/domain/catalog.test.js:95.

## FE-APICLIENT-01 envía cookie y CSRF sin guardar la credencial en localStorage

Módulo: Cliente HTTP. Requisito: RF-01 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Recuperar sesión mediante fetch simulado; ejecutar favorito y revisar cookie/CSRF y localStorage.

Esperado: Petición incluye credentials=include y X-CSRF-Token; localStorage no guarda credenciales.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Petición incluye credentials=include y X-CSRF-Token; localStorage no guarda credenciales. Duración del caso 4.88 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/apiClient.test.js:5.

## FE-APICLIENT-02 rechaza respuestas HTML sin mostrarlas como contenido de la aplicación

Módulo: Cliente HTTP. Requisito: RF-01 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Simular respuesta HTML 503 del proxy y solicitar catálogo.

Esperado: Error INVALID_RESPONSE status=503; HTML no se muestra como contenido.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Error INVALID_RESPONSE status=503; HTML no se muestra como contenido. Duración del caso 1.08 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/apiClient.test.js:27.

## FE-APICLIENT-03 mapea el catálogo de API a las tarjetas sin datos inventados

Módulo: Cliente HTTP. Requisito: RF-01 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Transformar artículo de renta y vendedor no verificado en tarjeta del catálogo.

Esperado: Modalidad Renta, tarifa 35, estado Disponible e iniciales AL; verified=false.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Modalidad Renta, tarifa 35, estado Disponible e iniciales AL; verified=false. Duración del caso 0.42 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/apiClient.test.js:41.

## FE-CAMPUSREPOSITORY-01 conserva publicaciones y favoritos al crear una sesión nueva

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear publicación y favorito; crear otra instancia del repositorio y leer snapshot.

Esperado: Mismo ID/precio 350.5 y favorito conservados; vendedor sigue sin verificar.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Mismo ID/precio 350.5 y favorito conservados; vendedor sigue sin verificar. Duración del caso 4.65 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:25.

## FE-CAMPUSREPOSITORY-02 genera identificadores únicos incluso en el mismo milisegundo

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear dos publicaciones consecutivas en el mismo ciclo de ejecución.

Esperado: Sus identificadores son distintos.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Sus identificadores son distintos. Duración del caso 0.66 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:36.

## FE-CAMPUSREPOSITORY-03 no permite modificar publicaciones de demostración ajenas

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Intentar editar y finalizar la publicación ajena ct-001.

Esperado: Ambas acciones lanzan error de propiedad.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Ambas acciones lanzan error de propiedad. Duración del caso 1.10 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:41.

## FE-CAMPUSREPOSITORY-04 edita, reserva y finaliza una publicación propia sin reabrirla

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear artículo propio; editar título; reservar; finalizar; intentar reabrir y editar.

Esperado: Edición/reserva correctas; estado final irreversible y edición posterior rechazada.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Edición/reserva correctas; estado final irreversible y edición posterior rechazada. Duración del caso 1.04 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:49.

## FE-CAMPUSREPOSITORY-05 no muta el estado cuando una entrada es inválida

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Intentar crear publicación con título en blanco sobre almacenamiento vacío.

Esperado: Error de validación y localStorage permanece sin documento.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Error de validación y localStorage permanece sin documento. Duración del caso 0.36 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:66.

## FE-CAMPUSREPOSITORY-06 propaga el perfil a sus publicaciones sin inventar verificación

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear artículo; editar perfil con nombre Ana López, carrera y semestre; consultar snapshot.

Esperado: Perfil e iniciales AL propagados a la publicación; verified=false.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Perfil e iniciales AL propagados a la publicación; verified=false. Duración del caso 0.74 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:72.

## FE-CAMPUSREPOSITORY-07 no sobrescribe datos dañados silenciosamente

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Guardar JSON roto; intentar leer y crear artículo.

Esperado: StorageError en ambos accesos; contenido roto se conserva.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: StorageError en ambos accesos; contenido roto se conserva. Duración del caso 0.31 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:86.

## FE-CAMPUSREPOSITORY-08 detecta un documento JSON válido con estructura incompatible

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear documento válido; eliminar modality; guardar y volver a consultar.

Esperado: Estructura incompatible detectada con StorageError.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Estructura incompatible detectada con StorageError. Duración del caso 0.38 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:92.

## FE-CAMPUSREPOSITORY-09 informa de falta de espacio y conserva el estado anterior

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear estado previo; simular QuotaExceededError; intentar otra creación.

Esperado: Mensaje No se pudo guardar y estado anterior idéntico.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Mensaje No se pudo guardar y estado anterior idéntico. Duración del caso 1.39 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:98.

## FE-CAMPUSREPOSITORY-10 lee los cambios guardados desde otra instancia antes de escribir

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear dos instancias; escribir artículo desde una y favorito ct-002 desde otra; leer de nuevo.

Esperado: Siete artículos en snapshot y escritura basada en el estado actualizado.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Siete artículos en snapshot y escritura basada en el estado actualizado. Duración del caso 0.74 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:112.

## FE-CAMPUSREPOSITORY-11 reutiliza conversaciones y mantiene sus mensajes separados

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Abrir dos conversaciones de artículos distintos, repetir una y enviar texto con espacios a la primera; recargar repositorio.

Esperado: Solo dos conversaciones; texto recortado en la primera y segunda vacía.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Solo dos conversaciones; texto recortado en la primera y segunda vacía. Duración del caso 1.02 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:121.

## FE-CAMPUSREPOSITORY-12 rechaza mensajes vacíos y conversaciones inexistentes

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Enviar texto vacío y después texto válido a conversación inexistente.

Esperado: Errores Escribe un mensaje y Selecciona una conversación respectivamente.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Errores Escribe un mensaje y Selecciona una conversación respectivamente. Duración del caso 0.28 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:135.

## FE-CAMPUSREPOSITORY-13 impide abrir una conversación con una publicación propia

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Crear artículo propio e intentar abrir su conversación.

Esperado: Error que impide conversar con la propia publicación.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Error que impide conversar con la propia publicación. Duración del caso 0.29 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:143.

## FE-CAMPUSREPOSITORY-14 registra reportes válidos y evita duplicados abiertos

Módulo: Regresión de repositorio local. Requisito: RF-03 RF-04 RF-09 RF-10 RF-12. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Reportar artículo válido; repetir reporte abierto; reportar otro sin detalle.

Esperado: Primer reporte Abierto persistido; duplicado y detalle vacío rechazados.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Primer reporte Abierto persistido; duplicado y detalle vacío rechazados. Duración del caso 0.50 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/campusRepository.test.js:147.

## FE-LISTINGIMAGE-01 rechaza archivos que solo declaran ser imágenes

Módulo: Regresión de imágenes locales. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Enviar bytes que declaran ser PNG sin firma válida.

Esperado: Promesa rechazada por contenido no válido.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Promesa rechazada por contenido no válido. Duración del caso 3.46 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/listingImage.test.js:4.

## FE-LISTINGIMAGE-02 rechaza formatos no permitidos y archivos grandes

Módulo: Regresión de imágenes locales. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Enviar SVG y archivo por encima del límite permitido.

Esperado: Formatos y tamaño indebidos rechazados.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Formatos y tamaño indebidos rechazados. Duración del caso 0.81 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/listingImage.test.js:9.

## FE-LISTINGIMAGE-03 lee una firma PNG compatible como data URL

Módulo: Regresión de imágenes locales. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:20:06-06:00. Precisión: Fin del archivo de pruebas, no instante individual.

Procedimiento: Leer fixture PNG válido con firma compatible.

Esperado: Data URL PNG válido devuelto.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Data URL PNG válido devuelto. Duración del caso 0.76 ms.

Entorno: Windows Vitest JSDOM; prototipo explícito o cliente HTTP según módulo. Evidencia: evidencias/frontend.json. Fuente: frontend/src/services/listingImage.test.js:23.

## E2E-DESKTOP-01 registro verificación publicación con imagen y edición persistentes

Módulo: Recorrido desktop. Requisito: RF-01 RF-02 RF-03 RF-04 RF-08. Estado: APROBADA.

Fecha: 2026-11-09T19:26:58-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear cuenta sintética por UI; obtener enlace del transporte aislado; verificar e iniciar sesión; publicar imagen y recargar; editar título y comprobar consola/ancho.

Esperado: Cuenta creada; diálogo de verificación se cierra; publicación y título editado persisten; sin pageerror ni desbordamiento.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Cuenta creada; diálogo de verificación se cierra; publicación y título editado persisten; sin pageerror ni desbordamiento. Duración del caso 1849.00 ms.

Entorno: Chromium escritorio y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/fullstack.spec.js:21.

## E2E-DESKTOP-02 catálogo y favoritos persisten entre sesiones del navegador

Módulo: Recorrido desktop. Requisito: RF-06 RF-07 RF-10. Estado: APROBADA.

Fecha: 2026-11-09T19:26:58-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear vendedor y comprador aislados; buscar artículo; agregar favorito; recargar; salir y volver a iniciar sesión.

Esperado: Artículo buscado visible y favorito conservado después de recarga y nuevo login.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Artículo buscado visible y favorito conservado después de recarga y nuevo login. Duración del caso 1817.00 ms.

Entorno: Chromium escritorio y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/fullstack.spec.js:113.

## E2E-DESKTOP-03 una cuenta sin verificar no publica ni obtiene una insignia falsa

Módulo: Recorrido desktop. Requisito: RF-02 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:27:01-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear cuenta sintética sin verificar; iniciar sesión y pulsar Publicar artículo.

Esperado: Aviso de verificación pendiente y error Verifica tu correo institucional; no se abre formulario.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Aviso de verificación pendiente y error Verifica tu correo institucional; no se abre formulario. Duración del caso 662.00 ms.

Entorno: Chromium escritorio y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/fullstack.spec.js:156.

## E2E-DESKTOP-04 mensajes entre dos sesiones y venta con calificación

Módulo: Recorrido desktop. Requisito: RF-05 RF-09 RF-11 RF-13. Estado: APROBADA.

Fecha: 2026-11-09T19:27:02-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Abrir dos contextos; comprador y vendedor intercambian mensajes sobre biblioteca; solicitar, aceptar y finalizar venta; calificar.

Esperado: Ambas sesiones reciben mensajes; operación finalizada; calificación guardada y reputación 5; sin desbordamiento.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Ambas sesiones reciben mensajes; operación finalizada; calificación guardada y reputación 5; sin desbordamiento. Duración del caso 12481.00 ms.

Entorno: Chromium escritorio y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/workflows.spec.js:27.

## E2E-DESKTOP-05 reporte y resolución real desde la administración

Módulo: Recorrido desktop. Requisito: RF-12 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:27:02-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear reporte como estudiante; entrar como admin del esquema de pruebas; resolverlo; volver al perfil del reportante.

Esperado: Reporte guardado; resolución persistida y visible para administrador y reportante.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Reporte guardado; resolución persistida y visible para administrador y reportante. Duración del caso 2451.00 ms.

Entorno: Chromium escritorio y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/workflows.spec.js:130.

## E2E-MOBILE-01 registro verificación publicación con imagen y edición persistentes

Módulo: Recorrido mobile. Requisito: RF-01 RF-02 RF-03 RF-04 RF-08. Estado: APROBADA.

Fecha: 2026-11-09T19:27:05-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear cuenta sintética por UI; obtener enlace del transporte aislado; verificar e iniciar sesión; publicar imagen y recargar; editar título y comprobar consola/ancho.

Esperado: Cuenta creada; diálogo de verificación se cierra; publicación y título editado persisten; sin pageerror ni desbordamiento.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Cuenta creada; diálogo de verificación se cierra; publicación y título editado persisten; sin pageerror ni desbordamiento. Duración del caso 1514.00 ms.

Entorno: Chromium Pixel 7 emulado y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/fullstack.spec.js:21.

## E2E-MOBILE-02 catálogo y favoritos persisten entre sesiones del navegador

Módulo: Recorrido mobile. Requisito: RF-06 RF-07 RF-10. Estado: APROBADA.

Fecha: 2026-11-09T19:27:07-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear vendedor y comprador aislados; buscar artículo; agregar favorito; recargar; salir y volver a iniciar sesión.

Esperado: Artículo buscado visible y favorito conservado después de recarga y nuevo login.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Artículo buscado visible y favorito conservado después de recarga y nuevo login. Duración del caso 1374.00 ms.

Entorno: Chromium Pixel 7 emulado y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/fullstack.spec.js:113.

## E2E-MOBILE-03 una cuenta sin verificar no publica ni obtiene una insignia falsa

Módulo: Recorrido mobile. Requisito: RF-02 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:27:08-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear cuenta sintética sin verificar; iniciar sesión y pulsar Publicar artículo.

Esperado: Aviso de verificación pendiente y error Verifica tu correo institucional; no se abre formulario.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Aviso de verificación pendiente y error Verifica tu correo institucional; no se abre formulario. Duración del caso 748.00 ms.

Entorno: Chromium Pixel 7 emulado y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/fullstack.spec.js:156.

## E2E-MOBILE-04 mensajes entre dos sesiones y venta con calificación

Módulo: Recorrido mobile. Requisito: RF-05 RF-09 RF-11 RF-13. Estado: APROBADA.

Fecha: 2026-11-09T19:27:10-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Abrir dos contextos; comprador y vendedor intercambian mensajes sobre biblioteca; solicitar, aceptar y finalizar venta; calificar.

Esperado: Ambas sesiones reciben mensajes; operación finalizada; calificación guardada y reputación 5; sin desbordamiento.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Ambas sesiones reciben mensajes; operación finalizada; calificación guardada y reputación 5; sin desbordamiento. Duración del caso 12570.00 ms.

Entorno: Chromium Pixel 7 emulado y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/workflows.spec.js:27.

## E2E-MOBILE-05 reporte y resolución real desde la administración

Módulo: Recorrido mobile. Requisito: RF-12 RF-14. Estado: APROBADA.

Fecha: 2026-11-09T19:27:15-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Crear reporte como estudiante; entrar como admin del esquema de pruebas; resolverlo; volver al perfil del reportante.

Esperado: Reporte guardado; resolución persistida y visible para administrador y reportante.

Obtenido: Todas las aserciones del caso se cumplieron. Resultado comprobado: Reporte guardado; resolución persistida y visible para administrador y reportante. Duración del caso 2587.00 ms.

Entorno: Chromium Pixel 7 emulado y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/workflows.spec.js:130.

## E2E-DESKTOP-06 filtros visibles sin recorte y reinicio de criterios

Módulo: Filtros y adaptación móvil. Requisito: RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:27:02-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Abrir Explorar y Filtros; comprobar los límites reales de siete controles; elegir Libros y Renta, precio mínimo 100; limpiar filtros. En móvil forzar 320x760.

Esperado: Ningún control rebasa panel o viewport; categoría, modalidad y precio vuelven al valor inicial.

Obtenido: Todos los límites dentro del panel y del viewport; valores vacíos tras limpiar. Aserciones E2E aprobadas.

Entorno: Chromium desktop y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/responsive.spec.js:4.

## E2E-MOBILE-06 filtros visibles sin recorte y reinicio de criterios

Módulo: Filtros y adaptación móvil. Requisito: RF-06 RF-07. Estado: APROBADA.

Fecha: 2026-11-09T19:27:09-06:00. Precisión: Inicio individual del recorrido.

Procedimiento: Abrir Explorar y Filtros; comprobar los límites reales de siete controles; elegir Libros y Renta, precio mínimo 100; limpiar filtros. En móvil forzar 320x760.

Esperado: Ningún control rebasa panel o viewport; categoría, modalidad y precio vuelven al valor inicial.

Obtenido: Todos los límites dentro del panel y del viewport; valores vacíos tras limpiar. Aserciones E2E aprobadas.

Entorno: Chromium mobile y PostgreSQL local aislado. Evidencia: evidencias/navegador.json. Fuente: frontend/e2e/responsive.spec.js:4.

## PROD-01 HTTPS health y PostgreSQL

Módulo: Disponibilidad y base de datos. Requisito: RF-01 RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Enviar GET /api/v1/health sobre HTTPS.

Esperado: HTTP 200, status ok y database connected.

Obtenido: {"http": 200, "status": "ok", "database": "connected", "version": "0.3.0"}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-02 Dominio institucional itesa.edu.mx

Módulo: Dominio institucional. Requisito: RF-01 RF-02. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Enviar GET /api/v1/catalog y leer emailDomains.

Esperado: Lista exacta [itesa.edu.mx].

Obtenido: {"http": 200, "emailDomains": ["itesa.edu.mx"]}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-03 Portada React y cabeceras de seguridad

Módulo: Frontend y seguridad HTTP. Requisito: RF-06. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Enviar GET /; revisar CSP, nosniff y tipo HTML.

Esperado: HTTP 200, CSP presente y X-Content-Type-Options nosniff.

Obtenido: {"http": 200, "contentType": "text/html; charset=utf-8", "csp": true, "nosniff": "nosniff"}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-04 Entradas de distribución actualizadas

Módulo: Versión del frontend. Requisito: RF-04 RF-06. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Comparar las entradas JS y CSS del HTML con el build del commit publicado.

Esperado: Todas las entradas del build están en el HTML productivo.

Obtenido: {"entrypoints": ["./assets/index-eN7Fx0qN.js", "./assets/index-D17YjgnF.css"]}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-05 Activo exacto: ConnectedApp-BzSzXHRt.js

Módulo: Distribución de recursos. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Descargar cada recurso JS, CSS o WebP y comparar su SHA-256 con el build.

Esperado: HTTP 200 y hash idéntico al archivo local del commit publicado.

Obtenido: {"http": 200, "bytes": 62680, "sha256": "94261d69afd1a9c62f7c32e3b5649759a13a42289968ac93352025dba450a354"}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-06 Activo exacto: campus-essentials-CAy3ksIO.webp

Módulo: Distribución de recursos. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Descargar cada recurso JS, CSS o WebP y comparar su SHA-256 con el build.

Esperado: HTTP 200 y hash idéntico al archivo local del commit publicado.

Obtenido: {"http": 200, "bytes": 88108, "sha256": "20e20552c219ead05f617d295fc27061656f306e2606a07cfb985b5d6144e4b2"}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-07 Activo exacto: index-D17YjgnF.css

Módulo: Distribución de recursos. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Descargar cada recurso JS, CSS o WebP y comparar su SHA-256 con el build.

Esperado: HTTP 200 y hash idéntico al archivo local del commit publicado.

Obtenido: {"http": 200, "bytes": 35625, "sha256": "2fa482ff892725ede1a633fd04d9adc1656b94bffcf9c7148814e157207a2efb"}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.

## PROD-08 Activo exacto: index-eN7Fx0qN.js

Módulo: Distribución de recursos. Requisito: RF-04. Estado: APROBADA.

Fecha: 2026-11-09T19:40:56-06:00. Precisión: Fin del lote de lecturas públicas.

Procedimiento: Descargar cada recurso JS, CSS o WebP y comparar su SHA-256 con el build.

Esperado: HTTP 200 y hash idéntico al archivo local del commit publicado.

Obtenido: {"http": 200, "bytes": 142425, "sha256": "8ab274ae4dc8e866748810399f0fd354f894a462416f6cf73cb3c59418ad3caa"}

Entorno: Render Free HTTPS, PostgreSQL externo, solo lectura anónima. Evidencia: evidencias/produccion-https.json. Fuente: evidencias/produccion-https.json.
