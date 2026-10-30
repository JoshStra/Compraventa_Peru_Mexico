# Despliegue gratuito preparado y accesos pendientes

Estado al 30-10-2026: **BLOQUEADO en la publicación externa**. No hay URL pública verificada. La aplicación local integrada sí funciona y está probada. Render y Neon no estaban conectados mediante herramientas autorizadas; tampoco existen credenciales de almacenamiento externo ni proveedor de correo definido. No se crearon cuentas, no se aceptaron planes de pago y no se generaron cargos.

## Arquitectura elegida

Un Web Service Node gratuito en Render sirve frontend/dist y /api/v1 desde el mismo HTTPS, conectado a Neon Free por TLS y a un bucket S3 compatible para imágenes. Se evaluó Cloudflare Pages para cliente: es apropiado para estáticos, pero separar dominios complica cookies y CSRF; un solo origen reduce configuración y no necesita otro servicio. render.yaml prepara la aplicación completa, sin crear una base temporal Render Postgres.

Condiciones consultadas el 30-10-2026 en fuentes oficiales:

| Servicio                    | Condiciones relevantes                                                                                                                                      | Decisión                                                                                                                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Render Free                 | 750 horas compartidas/mes; suspensión tras 15 min sin uso y arranque frío; disco efímero; SMTP 25/465/587 bloqueado. Render Postgres Free caduca a 30 días. | Solo Web Service free, sin disco persistente local ni Postgres temporal. La cuenta puede requerir verificación de pago; no introducir tarjeta ni cambiar de plan sin intervención del responsable. |
| Neon Free                   | 100 proyectos, 100 CU-h/mes y 1 GB por proyecto, 5 GB de transferencia/proyecto; escala a cero.                                                             | PostgreSQL externo persistente sujeto a cuotas; no promesa de disponibilidad continua.                                                                                                             |
| Supabase Free, candidato S3 | 1 GB de archivos; proyectos gratis sujetos a pausa por inactividad; protocolo S3 documentado.                                                               | Alternativa preparada pero no creada ni probada. Confirmar plan, cuotas y endpoint/región al conectar; bucket privado.                                                                             |
| Correo                      | Proveedor por decidir; el responsable pidió dejarlo pendiente.                                                                                              | Sin entrega institucional real. En Render Free usar una API HTTPS si se elige Resend; SMTP estándar no funciona allí.                                                                              |

Fuentes: [Render Free](https://render.com/docs/free), [Blueprint](https://render.com/docs/blueprint-spec), [Neon Free vigente](https://neon.com/blog/neon-free-plan-1-gb-per-project), [cuotas Neon](https://github.com/neondatabase/website/blob/main/content/faqs/free-plan-limits-and-quotas.md), [Supabase precios](https://supabase.com/pricing), [S3 Supabase](https://supabase.com/docs/guides/storage/s3/authentication). Son condiciones actuales consultadas, no garantía futura. El responsable debe comprobar privacidad, región y cuotas antes de incorporar datos reales.

## Pasos exactos del responsable

1. Conectar Render y Neon con las cuentas del proyecto y seleccionar exclusivamente Free. Si se pide tarjeta, aceptar términos o plan de pago, resolverlo personalmente; esta ejecución no lo hizo.
2. Crear proyecto Neon en región cercana al backend. Obtener DATABASE_URL de conexión directa con TLS (`sslmode=require`), conservarla solo en secretos de Render. La conexión directa evita problemas de search_path y bloqueos asesores con agrupación por transacción.
3. Crear bucket privado compatible S3, por ejemplo Supabase Free; generar credenciales restringidas y obtener endpoint HTTPS y región. Introducir S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID y S3_SECRET_ACCESS_KEY en Render. No usar disco efímero para imágenes.
4. Crear Web Service del origin y main, runtime Node 24, plan free. Usar render.yaml o configurar build `npm ci --include=dev && npm run build`, start `npm start`, health `/api/v1/health`, HOST=0.0.0.0, NODE_ENV=production, TRUST_PROXY=1. Mantener despliegue automático apagado hasta verificar.
5. Configurar PUBLIC_URL y CORS_ORIGINS con el mismo origen HTTPS asignado, sin barra final. APP_SECRET aleatorio de al menos 32 caracteres; ALLOWED_EMAIL_DOMAINS=itesa.edu.mx; STORAGE_DRIVER=s3. No publicar secretos en el repo ni en el frontend. El arranque aplica migraciones y solo escucha después de conectar.
6. El correo queda pendiente por decisión explícita. Antes de aceptar alumnos reales elegir proveedor, autorizar remitente, establecer MAIL_FROM y RESEND_API_KEY o SMTP compatible; comprobar un enlace real con una cuenta institucional consentida. Nunca usar el transporte de pruebas en producción.
7. Verificar GET health y catálogo, registro/login/logout, subida/consulta de imagen, publicación, favorito, mensaje con dos usuarios, solicitud, finalización, reporte y resolución. Reiniciar/redeploy y confirmar que la publicación y el objeto continúan. Capturar URL HTTPS y respuestas sin tokens. El health por sí solo no valida la aplicación completa.
8. Promover solo una cuenta real ya verificada mediante la CLI administrativa en un entorno seguro con la misma base. No existe contraseña administrativa predeterminada.

## Actualización y recuperación

Antes de un cambio importante guardar cambios pendientes probados o identificar HEAD limpio. Ejecutar CI, respaldar base/objetos y desplegar el SHA aprobado. Migraciones nuevas deben ser compatibles con la versión anterior; no editar las aplicadas. Para revertir código elegir el SHA previo en Render sin reset ni push forzado. Una migración destructiva requiere respaldo y plan propio; no se revierte automáticamente.

Restaurar backups primero en una base nueva; comprobar health, relaciones y operaciones, restaurar objetos y después cambiar secretos de conexión. La rotación de APP_SECRET invalida HMAC de matrículas y CSRF: requiere migración planificada, no reemplazo improvisado. La restauración y el comportamiento S3 externo no se probaron por falta de accesos. Mantener límites de cuota y no habilitar facturación automática.
