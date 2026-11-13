# Registro sin confirmación de correo

El 12 de noviembre de 2026 el responsable solicitó retirar la confirmación de correo como requisito de CampusTrade. El cambio se aplica a cuentas nuevas y existentes.

## Uso actual

1. Registra nombre, correo con dominio exacto `itesa.edu.mx`, matrícula, carrera, semestre y contraseña.
2. Inicia sesión con tu correo y contraseña. El registro mantiene una respuesta genérica para no revelar si una cuenta ya existía.
3. Publica artículos, sube imágenes, conversa con vendedores y solicita operaciones. Se requiere una sesión activa y los permisos correspondientes a cada recurso.

El registro no envía correo ni crea enlaces de verificación. Se retiraron las insignias, los bloqueos de la interfaz y el middleware de correo verificado. Las rutas `/auth/verify` y `/auth/verification` devuelven 404 y los enlaces anteriores ya no se consumen. El perfil y la administración conservan la información de contacto y el estado activo o suspendido.

## Controles conservados

- Dominio exacto autorizado, validación de campos y contraseña con Argon2id.
- Sesiones revocables, CSRF, origen autorizado y límites de intentos.
- Propiedad de publicaciones e imágenes y participación en conversaciones y operaciones.
- Acceso administrativo solo mediante rol explícito, con auditoría; el registro no permite asignarlo.
- Suspensión de usuarios y revocación de sus sesiones.
- Recuperación de contraseña con enlaces de caducidad y uso único; completar el cambio revoca sesiones anteriores.

La herramienta local de promoción administrativa exige una cuenta existente y activa; ya no exige el campo histórico de verificación. Este incremento no ejecuta promociones ni cambia credenciales de cuentas existentes.

Se conservaron las columnas y valores históricos `verified_at` y `verified` para evitar cambios destructivos y mantener compatibilidad de lectura. No autorizan acciones, no se muestran como insignia ni se actualizan automáticamente. No fue necesaria una migración de base de datos. Los tokens antiguos de verificación no son aceptados por el flujo de recuperación.

## Alcance

Una persona puede escribir una dirección con `itesa.edu.mx` sin tener acceso a ese buzón. El formato y dominio validan qué direcciones se admiten; no demuestran identidad institucional ni titularidad del correo. La confirmación real queda fuera del comportamiento actual. Las [opciones anteriores](OPCIONES_VERIFICACION.md) se conservan como propuestas futuras.

Mailpit sigue disponible únicamente para [recuperación de contraseña de demostración](CORREO_DEMO.md), en loopback. No se envían correos reales a ITESA. Las pruebas completas y sus límites están en [evidencia de ejecución](registro-sin-confirmacion/2026-11-12/README.md).
