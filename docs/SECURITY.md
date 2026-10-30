# Controles de seguridad implementados

## Cuentas y sesiones

Las contraseñas se validan con longitud de 12 a 128 caracteres y se almacenan con Argon2id. La matrícula se conserva como HMAC con APP_SECRET, no en texto claro. El registro solo acepta dominios de ALLOWED_EMAIL_DOMAINS; el usuario confirmó itesa.edu.mx para esta instalación. La API no permite asignar roles desde el registro.

Las sesiones usan tokens aleatorios de 256 bits en cookie HttpOnly, Secure en producción y SameSite Lax, con caducidad configurable de hasta siete días. En PostgreSQL se guarda únicamente su hash. Se eligieron sesiones opacas revocables en servidor en lugar del JWT propuesto inicialmente: permiten cerrar sesión y revocar accesos inmediatamente sin una lista adicional de tokens. El frontend no debe guardar la credencial de sesión en localStorage.

Cada escritura exige un Origin autorizado y las sesiones autenticadas requieren además un token CSRF derivado en el servidor. CORS utiliza orígenes exactos. Los endpoints sensibles limitan intentos y las respuestas de credenciales inválidas son genéricas. Los tokens de verificación y recuperación son aleatorios, caducan y solo se usan una vez; restablecer la contraseña revoca las sesiones anteriores.

## Verificación institucional y correo

Una cuenta nace sin verificar. La coincidencia con el dominio autorizado no activa el estado verified. La activación requiere consumir el enlace enviado a su correo por un transporte configurado: API HTTPS de Resend o SMTP.

IMPLEMENTADO Y VERIFICADO: flujo de tokens de un solo uso con transporte de prueba aislado y cuentas sintéticas campus.test. BLOQUEADO para envío real: falta configurar credenciales y remitente de correo. No se han enviado mensajes reales ni verificado cuentas universitarias durante las pruebas.

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

La moderación exige rol admin en middleware y servicio, deja registros de decisión y conserva los historiales. La promoción inicial se realiza por una herramienta local y solo sobre una cuenta activa con correo verificado. Los datos privados de la API usan Cache-Control no-store. El almacenamiento de imágenes productivo exige S3; la implementación de desarrollo se prueba con archivos aislados.
