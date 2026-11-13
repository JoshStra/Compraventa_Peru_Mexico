# Controles de seguridad implementados

La instalación actual se ejecuta en [Docker local](DOCKER_LOCAL.md). El proceso HTTP usa `campustrade_app`, limitado a su base y sin privilegios administrativos del clúster. Sus secretos se inyectan en ejecución y no forman parte de la imagen; la aplicación corre sin root, con filesystem de solo lectura y un volumen escribible para imágenes. Render está suspendido y las conexiones remotas anteriores se conservan como respaldo privado.

La revisión del 10 de noviembre de 2026, sus hallazgos, pruebas y límites se documentan en [SECURITY_AUDIT.md](../SECURITY_AUDIT.md). El registro responde de forma genérica con 202, el login limita fallos por cuenta además de IP, las subidas serializan el cupo en PostgreSQL y las operaciones revalidan modalidades y devoluciones anteriores. La auditoría usa una rama independiente; aplicar esos cambios a producción requiere una revisión y despliegue posteriores.

## Cuentas y sesiones

Las contraseñas se validan con longitud de 12 a 128 caracteres y se almacenan con Argon2id. La matrícula se conserva como HMAC con APP_SECRET, no en texto claro. El registro solo acepta dominios de ALLOWED_EMAIL_DOMAINS; el usuario confirmó itesa.edu.mx para esta instalación. La API no permite asignar roles desde el registro.

Las sesiones usan tokens aleatorios de 256 bits en cookie HttpOnly, Secure en producción y SameSite Lax, con caducidad configurable de hasta siete días. En PostgreSQL se guarda únicamente su hash. Se eligieron sesiones opacas revocables en servidor en lugar del JWT propuesto inicialmente: permiten cerrar sesión y revocar accesos inmediatamente sin una lista adicional de tokens. El frontend no debe guardar la credencial de sesión en localStorage.

Cada escritura exige un Origin autorizado y las sesiones autenticadas requieren además un token CSRF derivado en el servidor. CORS utiliza orígenes exactos. Los endpoints sensibles limitan intentos y las respuestas de credenciales inválidas son genéricas. Los tokens de recuperación son aleatorios, caducan y solo se usan una vez; restablecer la contraseña revoca las sesiones anteriores.

## Registro sin confirmación y correo de recuperación

Por solicitud expresa del responsable se retiró la confirmación de correo el 12 de noviembre de 2026. Una cuenta registrada puede iniciar sesión y operar sin un enlace. La coincidencia exacta con itesa.edu.mx valida la dirección admitida, sin demostrar control del buzón ni pertenencia real a la institución. Se conservaron contraseña, CSRF, límites de intentos, suspensión, propiedad de recursos, participación en conversaciones y rol administrativo.

El registro no envía correo ni genera tokens de verificación; sus endpoints de confirmación y reenvío se retiraron. Los campos históricos verified_at y verified conservan sus valores, sin controlar el acceso. No se marcaron cuentas verificadas para retirar el requisito. Los tokens antiguos de verificación no sirven para cambiar contraseñas. La recuperación conserva el enlace de un uso y la revocación de sesiones, con [Mailpit local](CORREO_DEMO.md); no se envían mensajes reales a ITESA.

MAIL_DELIVERY_MODE=local_demo exige SMTP local, URL del buzón HTTP en loopback y ausencia de Resend; se rechaza en producción. Compose publica únicamente la interfaz del buzón en 127.0.0.1; SMTP no se publica al host. El buzón contiene enlaces sensibles de recuperación y debe conservarse privado. Para envío real se requiere un remitente SMTP o Resend autorizado. Las [opciones de confirmación](OPCIONES_VERIFICACION.md) quedan como propuestas futuras.

## Base y API

Las consultas usan parámetros y las migraciones incluyen claves foráneas, rangos e índices de unicidad. Los errores internos se ocultan tras un identificador de solicitud y los logs del servidor omiten cuerpos, contraseñas y tokens. La configuración de producción exige HTTPS y almacenamiento de objetos externo.

Las pruebas se ejecutan en esquemas PostgreSQL con prefijo test y nombres aleatorios; se rechazan conexiones de pruebas a hosts ajenos a localhost. Los fixtures no representan alumnos reales. Las pruebas iniciales del esquema únicamente verifican catálogo y rollback en la base local del proyecto.

La autorización de publicaciones, conversaciones, operaciones, calificaciones y administración está conectada a las rutas y comprobada con pruebas PostgreSQL. La sección final detalla esos controles.

## Referencias técnicas

- [Seguridad en Express](https://expressjs.com/advanced/best-practice-security/)
- [Almacenamiento de contraseñas de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Transacciones con node-postgres](https://node-postgres.com/features/transactions)

## Autorización de recursos comprobada

Las rutas de publicación, imagen, favoritos, conversación y operación asignan identidad desde la sesión. Los terceros no pueden modificar artículos ni acceder a mensajes privados. Las reservas y los intercambios bloquean filas PostgreSQL antes de transicionar; las calificaciones se vinculan a operaciones completadas y al otro participante.

La moderación exige rol admin en middleware y servicio, deja registros de decisión y conserva los historiales. La herramienta de promoción inicial exige una cuenta existente y activa; ya no depende del campo histórico de verificación. El registro público no permite asignar roles. La asignación individual autorizada antes de retirar el requisito conserva su evento `admin_assigned_pending_verification` en la auditoría. Este incremento no cambia roles ni credenciales existentes. Los datos privados de la API usan Cache-Control no-store. El almacenamiento de imágenes productivo exige S3; la implementación de desarrollo se prueba con archivos aislados.
