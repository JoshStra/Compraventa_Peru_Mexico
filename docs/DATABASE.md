# Base de datos PostgreSQL

La migración `backend/migrations/001_initial.sql` crea usuarios, sesiones y tokens de acceso; categorías y carreras; publicaciones y referencias de imágenes; favoritos; conversaciones y mensajes; operaciones; calificaciones; reportes y auditoría. PostgreSQL genera los UUID, conserva las fechas y verifica claves foráneas, rangos y unicidad. Los importes se guardan en centavos enteros.

El ejecutor aplica migraciones ordenadas dentro de una transacción y bloqueo asesor. Guarda su checksum y rechaza modificaciones retroactivas a una migración aplicada. Cada transacción de negocio utiliza la misma conexión hasta COMMIT o ROLLBACK.

Para desarrollo, copia los archivos `.env.example` a `.env` y `backend/.env`, introduce secretos aleatorios, ejecuta `docker compose up -d db` y `npm run migrate`. El puerto 55432 solo escucha en 127.0.0.1 y el volumen `campustrade_postgres_data` conserva los datos entre reinicios. No uses `docker compose down -v` si necesitas conservarlos.

Las pruebas de backend requieren una base dedicada. La configuración de pruebas se ampliará con aislamiento de esquema antes de insertar fixtures; no se deben ejecutar sobre datos de producción. El primer incremento verifica migraciones idempotentes, catálogo, health y rollback.

La restricción parcial `one_accepted_operation_idx` impide dos operaciones aceptadas sobre una publicación. Los servicios de operaciones deberán combinarla con bloqueo de las publicaciones involucradas y validación de transiciones; el índice por sí solo no implementa el flujo.

La migración 002_operation_amounts amplía a bigint el importe de operaciones para representar hasta noventa días de renta sin desbordamiento. El backend verifica estados y bloquea las filas implicadas dentro de la misma transacción, además del índice de unicidad. Las pruebas incluyen aceptaciones simultáneas y reutilización concurrente de un artículo ofrecido en intercambio.
