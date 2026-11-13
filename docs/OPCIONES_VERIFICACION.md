# Opciones para verificar el correo institucional

Propuestas para CampusTrade, revisadas el 12 de noviembre de 2026. El dominio admitido sigue siendo `itesa.edu.mx`. Comprobar su formato o que el dominio exista no demuestra que una persona controle una dirección concreta.

| Opción                           | Cómo funcionaría                                                                   | Requisitos y alcance                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Enlace de un solo uso            | Registrar la cuenta, enviar el enlace al correo real y confirmar al consumirlo     | Es la adaptación más corta: la API ya implementa tokens con caducidad y uso único. Falta un remitente con envío autorizado.                                                                            |
| Código por correo                | Enviar un código temporal y pedirlo en el registro                                 | Necesita el mismo servicio de envío. Requiere caducidad, intentos limitados y almacenamiento seguro. Cambia la interacción, pero no elimina la necesidad de entregar un mensaje real.                  |
| Acceder con Google institucional | Autenticar al usuario con Google y validar la identidad en el servidor             | Aplicable si ITESA usa Google Workspace y permite la integración. Validar firma, destinatario, emisor, caducidad, `email_verified` y `hd=itesa.edu.mx`; una dirección escrita por el usuario no basta. |
| Aprobación administrativa        | Un responsable valida al estudiante por un medio institucional y aprueba su acceso | Útil como alternativa escolar. Debe tener un estado y auditoría propios: aprobar a un alumno no equivale a verificar que controla su buzón. No está implementada como flujo nuevo.                     |

## Propuesta para este proyecto

Conservar el enlace que ya está implementado y, si existe una cuenta dedicada disponible, configurar envío real desde ella. Gmail puede admitir una contraseña de aplicación cuando la cuenta tenga verificación en dos pasos y esa función esté disponible; algunas cuentas escolares o protegidas no la ofrecen. No usar ni solicitar por chat la contraseña habitual de una cuenta. La credencial de envío se configuraría como secreto privado del backend.

Google recomienda sus métodos de acceso modernos frente a las contraseñas de aplicación. Si el correo institucional está alojado en Google Workspace, conviene evaluar el acceso institucional como solución posterior. Aún no se ha confirmado el proveedor de correo de ITESA ni los permisos para integrar su dominio.

Para una entrega sin remitente disponible, se puede mantener la demostración con Mailpit o diseñar aprobación manual, identificando sus límites. La captura local no prueba la titularidad del correo real. No se verifican ni aprueban cuentas automáticamente por pertenecer al dominio.

## Cambio de interfaz aplicado

Se retiraron el aviso global de cuenta sin verificar, el botón de reenvío, el acceso “Verificación de cuenta” en el menú y perfil, y los textos de estado del perfil propio. Se conservan los datos de contacto, edición de perfil, acceso administrativo y estados informativos de terceros. Las restricciones de la API, los tokens y los estados existentes siguen vigentes. Elegir una propuesta no la habilita automáticamente.

Fuentes: [contraseñas de aplicación de Google](https://support.google.com/accounts/answer/185833?hl=es) y [validación de identidad y dominio alojado de Google](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token?hl=es-419).
