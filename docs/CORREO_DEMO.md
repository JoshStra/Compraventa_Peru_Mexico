# Recuperación de contraseña con correo local

CampusTrade incluye Mailpit para demostrar la recuperación de contraseña sin contratar correo. El registro y el uso del sistema ya no requieren confirmar el buzón. Los mensajes de recuperación quedan en esta computadora y no se envían a ITESA.

## Usar la instalación preparada

1. Inicia Docker Desktop y ejecuta `iniciar-docker.cmd` o `docker compose up -d --build --wait`.
2. Abre [CampusTrade](http://127.0.0.1:3000/) y el formulario de inicio de sesión.
3. Pulsa **Olvidé mi contraseña** e indica el correo de tu cuenta.
4. Entra a [Mailpit](http://127.0.0.1:8025/) y abre tu mensaje **[DEMO LOCAL] Recupera tu acceso a CampusTrade**.
5. Abre su enlace, escribe y confirma tu nueva contraseña y pulsa **Guardar contraseña**. Cada enlace caduca y se utiliza una sola vez. Solicitar otro invalida el anterior; cambiar la contraseña revoca las sesiones previas.

Los endpoints de verificación y reenvío se retiraron. El registro no genera mensajes ni tokens. Las cuentas registradas pueden publicar, conversar y operar con sesión activa. Consulta [registro sin confirmación](REGISTRO_SIN_CONFIRMACION.md). No se ha contratado ni configurado un proveedor nuevo.

El buzón es compartido por esta instalación de demostración y muestra enlaces de recuperación destinados a sus cuentas. Utiliza solo tus propios enlaces y conserva privado su acceso. Las credenciales y roles existentes se conservan.

El rol administrador es independiente del estado de verificación. Una cuenta a la que se haya concedido ese rol encuentra **Gestión** en el menú del avatar y en **Perfil**. Si el rol se actualizó durante una sesión, recarga la página. Asignar el rol no modifica su contraseña ni verifica su correo.

## Preparar otra instalación

Requiere Docker Desktop y Node 24 para crear la configuración inicial:

```powershell
npm run docker:setup
npm run mail:demo:setup
docker compose up -d --build --wait
```

El segundo comando conserva las claves, la conexión, la base y los puertos existentes, guarda una copia privada anterior en `backend/.data/mail-demo/` y agrega el perfil `correo-demo` al `.env`. No sustituye un proveedor externo ya configurado. `MAILBOX_PORT` permite elegir otro puerto antes de ejecutar el asistente.

La app usa `MAIL_DELIVERY_MODE=local_demo`, SMTP `mailpit:1025` y remitente de demostración. El servicio Mailpit usa una imagen oficial con versión fijada y persiste mensajes en `campustrade_mailpit_data`. Solo su interfaz web se publica en `127.0.0.1:8025`; SMTP permanece dentro de Docker. La configuración privada y sus copias están excluidas de Git. Detener Compose sin `-v` conserva los datos.

La app puede arrancar y registrar cuentas sin Mailpit porque el perfil es opcional. Para recuperar contraseñas, comprueba con `docker compose ps` que `mailpit` esté saludable. La metadata `emailDeliveryConfigured` indica un transporte configurado, no una comprobación continua de conectividad. El modo de demostración no modifica `backend/.env`: los comandos de desarrollo fuera de Docker conservan su configuración separada.

## Límites y correo real

El diálogo de cambio de contraseña y el texto de sus mensajes identifican el modo de demostración. Se retiraron las insignias y el flujo de verificación; ninguna cuenta se marca verificada automáticamente. Validar el dominio de registro no prueba que la persona controle ese correo.

El servidor rechaza `local_demo` con `NODE_ENV=production`. No publiques este buzón ni configures reenvío a destinatarios externos. Para recuperar contraseñas por correo real se necesitará un proveedor SMTP o Resend, un remitente autorizado y configuración privada. Los datos sintéticos de demostración deben mantenerse separados de los de estudiantes reales.

## Prueba ejecutada

La [evidencia del registro sin confirmación](registro-sin-confirmacion/2026-11-12/README.md) conserva los resultados actuales de frontend, API, navegador, Docker y SMTP real a Mailpit. La evidencia inicial de verificación se conserva como histórica. Para repetir la comprobación SMTP en una instalación local preparada:

```powershell
Get-Content scripts/mail-demo-smoke.mjs -Raw | docker compose exec -T app node --input-type=module
```

El script se ejecuta por entrada estándar dentro de `app`, con las dependencias y configuración del contenedor. Crea un esquema PostgreSQL desechable y una cuenta sintética. Comprueba registro sin mensaje, publicación sin confirmación, captura de recuperación, sustitución y uso único de enlaces y revocación de sesiones. Retira solo sus mensajes y esquema, omite contraseñas y tokens de la salida y compara el estado de los usuarios existentes antes y después.

Referencias: [imagen oficial y puertos de Mailpit](https://mailpit.axllent.org/docs/install/docker/) y [API de Mailpit](https://mailpit.axllent.org/docs/api-v1/).
