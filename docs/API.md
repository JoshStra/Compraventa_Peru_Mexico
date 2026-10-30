# API REST de CampusTrade

Base: `/api/v1`. Las respuestas son JSON. Los errores contienen `error.code`, `error.message`, campos opcionales e identificador de solicitud. Las rutas de escritura requieren Origin autorizado; las sesiones autenticadas también requieren X-CSRF-Token obtenido en GET /auth/session. La cookie de sesión es HttpOnly y el cliente debe enviar credentials include.

## Rutas implementadas y verificadas

| Método        | Ruta                         | Acceso y resultado                                        |
| ------------- | ---------------------------- | --------------------------------------------------------- |
| GET           | /health                      | Público; verifica conexión PostgreSQL                     |
| GET           | /catalog                     | Público; categorías carreras y dominios autorizados       |
| POST          | /auth/register               | Registro sin asignación de rol ni verificación automática |
| POST          | /auth/login                  | Cookie de sesión y token CSRF                             |
| GET           | /auth/session                | Perfil privado propio y CSRF; no-store                    |
| POST          | /auth/logout                 | Revoca la sesión                                          |
| POST          | /auth/verification           | Solicita reenvío al correo propio                         |
| POST          | /auth/verify                 | Consume enlace de verificación de un uso                  |
| POST          | /auth/password-reset         | Solicitud genérica de recuperación                        |
| POST          | /auth/password-reset/confirm | Cambia contraseña y revoca sesiones                       |
| PATCH         | /me                          | Nombre carrera y semestre; no permite cambiar rol         |
| GET           | /listings                    | Catálogo público paginado                                 |
| GET           | /listings/:id                | Detalle y referencias de imágenes                         |
| POST          | /listings                    | Cuenta verificada; propietario asignado por servidor      |
| PATCH         | /listings/:id                | Cuenta verificada y propiedad; solo disponible            |
| DELETE        | /listings/:id                | Retiro lógico autorizado; conserva historial              |
| GET           | /me/listings                 | Publicaciones propias                                     |
| GET           | /me/favorites                | Favoritos propios e identificadores                       |
| POST y DELETE | /listings/:id/favorites      | Agregar o retirar favorito de forma idempotente           |
| POST          | /uploads                     | Cuenta verificada; multipart con un archivo image         |
| DELETE        | /uploads/:id                 | Elimina una imagen propia sin publicar                    |
| GET           | /images/:id                  | Imagen publicada o imagen pendiente del propietario       |

El catálogo acepta q, career, categoryId, modality, condition, status, minPrice, maxPrice, page y limit. page empieza en 1; limit admite de 1 a 50. Devuelve items, page, limit y total. Los precios son MXN; en renta se interpreta tarifa diaria. La base guarda centavos enteros.

Las modalidades son sale, rental, exchange y donation. Las condiciones son new, like_new, good y fair. Los estados de operación y el módulo de moderación se documentarán cuando sus rutas estén conectadas y probadas.

La carga valida formato declarado, extensión, decodificación y tamaño de hasta 5 MB; admite JPG PNG y WebP. Rechaza animación y más de veinte millones de píxeles, retira metadatos y normaliza a WebP. Cada publicación admite hasta cuatro referencias propias. La base no contiene binarios de imágenes. En producción el almacenamiento exige S3 compatible; la variante de desarrollo usa un directorio persistente local.

## Mensajería entre usuarios

GET /conversations devuelve hasta cien conversaciones propias ordenadas por actividad. POST /conversations recibe listingId y crea o reutiliza una conversación entre el interesado y el propietario. GET /conversations/:id/messages devuelve mensajes paginados, con los más recientes en la primera página y orden de lectura ascendente. POST en esa ruta recibe body de 1 a 2000 caracteres y asigna el emisor desde la sesión.

Abrir y escribir requiere correo verificado. La lectura exige sesión y participación; terceros no pueden leer ni enviar mensajes. Los textos se conservan como texto, sin HTML ejecutable, y se rechazan caracteres de control.

## Operaciones y calificaciones

GET /operations devuelve operaciones del usuario como propietario o solicitante. POST /operations recibe listingId y, según modalidad, rentalStart, rentalEnd u offeredListingId. PATCH /operations/:id recibe status: accepted, rejected, cancelled o completed. Solo el propietario acepta, rechaza y finaliza; los participantes cancelan cuando la transición es válida.

La aceptación bloquea todas las publicaciones relacionadas por UUID ordenado, valida disponibilidad y reserva ambos artículos en un intercambio. Las solicitudes incompatibles pendientes se rechazan. Una restricción parcial evita dos aceptaciones sobre el mismo artículo. Los estados terminales bloquean nuevas solicitudes. La renta admite de 1 a 90 días y conserva el importe acordado. POST /operations/:id/return permite al propietario registrar la devolución de una renta completada.

POST /operations/:id/ratings recibe score de 1 a 5 y comment de 5 a 1000 caracteres. Solo participa quien intervino en una operación completada y solo puede calificar una vez. GET /users/:id devuelve perfil público y calificaciones; no expone correo ni matrícula.

## Reportes y administración

POST /reports recibe listingId, reason y detail. GET /reports muestra los reportes propios y su resolución. Las razones admitidas son spam, inappropriate, fraud y prohibited; el detalle requiere de 10 a 1000 caracteres. Un índice impide repetir un reporte abierto.

Solo el rol admin accede a GET /admin/overview, PATCH /admin/reports/:id, PATCH /admin/users/:id, DELETE /admin/listings/:id, POST y PATCH /admin/categories y POST y PATCH /admin/careers. Los listados administrativos muestran hasta los cien registros más recientes. El cierre de un reporte exige resolución y conserva auditoría. No pueden retirarse artículos con reserva o renta activa sin resolver antes esa operación. Suspender una cuenta revoca sus sesiones, oculta su catálogo y exige cancelar reservas activas.

El registro público nunca concede administración. El responsable puede promover una cuenta existente, activa y verificada mediante npm run admin --workspace backend -- correo-institucional. Esta ejecución no creó administradores reales ni elevó cuentas de estudiantes.
