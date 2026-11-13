# Opciones para verificar el correo institucional

Propuestas futuras, revisadas el 12 de noviembre de 2026. La confirmación de correo se retiró posteriormente por solicitud del responsable, según [REGISTRO_SIN_CONFIRMACION.md](REGISTRO_SIN_CONFIRMACION.md). El dominio admitido sigue siendo `itesa.edu.mx`; comprobar su formato no demuestra que una persona controle una dirección concreta.

| Opción                           | Cómo funcionaría                                                                   | Requisitos y alcance                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Enlace de un solo uso            | Registrar la cuenta, enviar el enlace al correo real y confirmar al consumirlo     | Requiere reintroducir la confirmación y configurar un remitente autorizado; el patrón de recuperación actual conserva tokens con caducidad y uso único.                                                |
| Código por correo                | Enviar un código temporal y pedirlo en el registro                                 | Necesita el mismo servicio de envío. Requiere caducidad, intentos limitados y almacenamiento seguro. Cambia la interacción, pero no elimina la necesidad de entregar un mensaje real.                  |
| Acceder con Google institucional | Autenticar al usuario con Google y validar la identidad en el servidor             | Aplicable si ITESA usa Google Workspace y permite la integración. Validar firma, destinatario, emisor, caducidad, `email_verified` y `hd=itesa.edu.mx`; una dirección escrita por el usuario no basta. |
| Aprobación administrativa        | Un responsable valida al estudiante por un medio institucional y aprueba su acceso | Útil como alternativa escolar. Debe tener un estado y auditoría propios: aprobar a un alumno no equivale a verificar que controla su buzón. No está implementada como flujo nuevo.                     |

## Propuesta para este proyecto

Para una fase futura se podría reintroducir la confirmación por enlace usando el patrón de tokens que conserva la recuperación de contraseña. Harían falta endpoints de confirmación y un remitente autorizado. Gmail puede admitir una contraseña de aplicación con verificación en dos pasos cuando la cuenta ofrezca esa función. La credencial se configuraría como secreto privado del backend.

Google recomienda sus métodos de acceso modernos frente a las contraseñas de aplicación. Si el correo institucional está alojado en Google Workspace, conviene evaluar el acceso institucional como solución posterior. Aún no se ha confirmado el proveedor de correo de ITESA ni los permisos para integrar su dominio.

El comportamiento actual permite operar sin confirmar el buzón. Mailpit se conserva únicamente para recuperación de contraseña. Una futura aprobación administrativa tendría que implementarse por separado y no equivaldría a demostrar control del correo.

## Cambio de interfaz aplicado

Se retiraron avisos, accesos e insignias de verificación y el requisito de confirmar el correo en API e interfaz. Se conserva la autenticación, el dominio autorizado, la propiedad de recursos y los permisos administrativos. Ninguna cuenta se marca verificada automáticamente. Estas opciones son propuestas futuras.

Fuentes: [contraseñas de aplicación de Google](https://support.google.com/accounts/answer/185833?hl=es) y [validación de identidad y dominio alojado de Google](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token?hl=es-419).
