# Despliegue real de CampusTrade

Estado comprobado el **30 de octubre de 2026**: frontend React y API Node/Express publicados en **[CampusTrade](https://campustrade-mex-per.onrender.com/)**. [Health HTTPS](https://campustrade-mex-per.onrender.com/api/v1/health): HTTP 200, database=connected, versión base 0.3.0. El primer despliegue quedó Live a las **15:40:50 UTC−06**, desde `f5130c1f6dc30961969a9b42f3765dfae96060b4`. Los registros y capturas auténticos están en [evidencias de despliegue](../entregables/entregable_final/evidencias/despliegue/).

## Infraestructura existente

| Componente                | Recurso y configuración comprobada                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend y backend        | Render Web Service `campustrade-mex-per`, ID `srv-dbigt7hsrm7s73bmnvn0`, plan **Free ($0/mes)**, Virginia. Un solo origen HTTPS para interfaz, cookies y API.      |
| Código                    | Origin original `JoshStra/Compraventa_Peru_Mexico`, rama main. Fuente pública por URL, sin nueva concesión OAuth. Auto-deploy apagado.                             |
| PostgreSQL                | Neon Free, proyecto `campustrade` (`gentle-leaf-50085647`), PostgreSQL 17.11, AWS us-east-1. Base `campustrade`, rama `production` (`br-divine-king-b8sln8n1`).    |
| Validación de migraciones | Rama Neon aislada `deployment-validation` (`br-rapid-sea-b86fer0f`). Migraciones 001/002 aplicadas dos veces sin duplicación y luego aplicadas en producción.      |
| Imágenes                  | Supabase Free, proyecto aislado `campustrade-storage` (`vqwplhthmcdujjtnxqgr`), us-east-1. Bucket `campustrade-images`, **privado**, máximo 5 MB, MIME image/webp. |
| Correo                    | **Pendiente por decisión del responsable**. Sin proveedor ni remitente configurado; no se envían enlaces ni se verifican cuentas automáticamente.                  |

La conexión directa de Neon usa `sslmode=verify-full`; se comprobaron cifrado TLS y certificado autorizado desde Node. Ambas bases tienen 15 tablas (incluida schema_migrations), 33 índices, 30 CHECK y 25 claves foráneas. No se usa Render Postgres temporal ni disco local para imágenes. La Data API de Supabase está desactivada.

La clave S3 `campustrade-render` se creó con autorización explícita para este proyecto aislado. Supabase le concede acceso completo a sus buckets y omite RLS: es un secreto exclusivamente de backend. No es una clave limitada a un prefijo ni se entrega al navegador. No se contrató un servicio de pago.

## Configuración aplicada

Build: `npm ci --include=dev && npm run build`. Inicio: `npm start`. Health: `/api/v1/health`. Node 24.12.0; HOST=0.0.0.0; NODE_ENV=production; TRUST_PROXY=1; ALLOWED_EMAIL_DOMAINS=itesa.edu.mx; STORAGE_DRIVER=s3.

PUBLIC_URL y CORS_ORIGINS usan `https://campustrade-mex-per.onrender.com`, sin barra final. Se guardaron explícitamente después del primer arranque. El código también admite RENDER_EXTERNAL_URL para el primer despliegue, conserva el origen exacto y rechaza HTTP o rutas adicionales.

DATABASE_URL, APP_SECRET y las cinco variables S3 se guardan en Render Environment. El endpoint S3 es `https://vqwplhthmcdujjtnxqgr.storage.supabase.co/storage/v1/s3`, región us-east-1. Los valores secretos y las credenciales de la cuenta sintética están en configuración local privada excluida de Git, nunca en frontend ni evidencias. APP_SECRET se conserva entre despliegues.

## Validación pública y límites

Pasaron **28 comprobaciones HTTPS iniciales**: frontend, health, catálogo y listados; dominio incorrecto rechazado; registro sintético válido sin verificación ni entrega de correo; login y sesión; cookies Secure/HttpOnly/SameSite=Lax; perfil, favoritos y publicaciones propias; rechazo de CSRF ausente, origen ajeno, acceso anónimo y rol administrativo indebido. Publicar, subir imágenes, conversar y operar devuelven 403 a la cuenta sin verificar. El navegador mostró el perfil desde la base remota y no registró errores de consola.

Se probó S3 real con el mismo adaptador del backend, ejecutado desde un entorno local autorizado: WebP sintético de 76 bytes, GET firmado 200, acceso sin firma 403, tipo y SHA-256 coincidentes. Esta prueba acredita proveedor/adaptador/privacidad; no acredita publicación por un alumno verificado a través de Render. El redespliegue e4b14ff quedó Live a las 15:52:56 UTC−06; otras 26 comprobaciones HTTPS confirmaron identidad y sesión persistentes. El mismo objeto S3 conservó el hash y su privacidad. [Resultados posteriores](../entregables/entregable_final/evidencias/despliegue/https-after.json) y [persistencia de imagen](../entregables/entregable_final/evidencias/despliegue/storage-verify.json). El tag v0.3.0-rc.2 apunta al SHA desplegado; el cierre documental posterior se publica en main sin desplegarse automáticamente.

Los recorridos completos de publicación, mensajería, operaciones y moderación se probaron con PostgreSQL local y transporte de correo aislado. **No se simularon estudiantes verificados en producción**. RF-02 y esos recorridos productivos continúan pendientes de proveedor de correo, remitente y cuenta institucional consentida. Tampoco se ha probado restauración de respaldos ni carga sostenida.

## Actualización y recuperación

Antes de un cambio importante revisar Git y guardar cambios pendientes probados; con árbol limpio registrar HEAD. Ejecutar las pruebas pertinentes, conservar origin y subir un incremento coherente. En Render elegir Manual Deploy → Deploy latest commit, confirmar SHA, esperar Live y revisar health/logs. Con auto-deploy apagado, un push no publica por sí solo. Mantener el plan Free y no introducir tarjeta o aceptar un cambio de pago.

El inicio aplica migraciones antes de escuchar. Migraciones nuevas deben ser compatibles; no editar las ya aplicadas. Para revertir código elegir el SHA previo en Render, sin reset ni push forzado. Una migración destructiva necesita respaldo y plan específico. La rotación de APP_SECRET afecta matrículas HMAC y CSRF y requiere planificación.

Restaurar respaldos primero en una base nueva, comprobar relaciones y objetos y después cambiar la conexión. Esa restauración sigue sin ensayo. Neon y Supabase externos conservan los datos fuera del disco efímero de Render, sujetos a cuotas, pausas e inactividad de planes gratuitos; no se promete disponibilidad continua.

Referencias oficiales consultadas el 30-10-2026: [Render Free](https://render.com/docs/free), [Blueprint](https://render.com/docs/blueprint-spec), [Neon Free](https://neon.com/blog/neon-free-plan-1-gb-per-project), [Supabase precios](https://supabase.com/pricing), [S3 Supabase](https://supabase.com/docs/guides/storage/s3/authentication). Verificar condiciones vigentes antes de incorporar datos reales.
