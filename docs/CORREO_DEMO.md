# Correo de demostración local

CampusTrade incluye Mailpit para demostrar el registro, la verificación y la recuperación de acceso sin contratar correo. Los mensajes quedan en esta computadora. No se envían a ITESA y consumir sus enlaces no acredita la titularidad del buzón institucional.

## Usar la instalación preparada

1. Inicia Docker Desktop y ejecuta `iniciar-docker.cmd` o `docker compose up -d --build --wait`.
2. Abre [CampusTrade](http://127.0.0.1:3000/). El apartado de verificación y el botón de reenvío se retiraron del perfil, del menú y de la página por solicitud del responsable. Recarga si conservabas una vista anterior.
3. Para una cuenta de demostración recién registrada, entra a [Mailpit](http://127.0.0.1:8025/) desde su dirección local.
4. Abre su mensaje con asunto **[DEMO LOCAL] Verifica tu correo institucional en CampusTrade** y abre su enlace.
5. En CampusTrade pulsa **Verificar mi correo**. Se mostrará **Verificación de demostración completada**. Cada enlace se usa una sola vez y tiene caducidad. Las cuentas anteriores conservan su estado; no se marcan verificadas por retirar el apartado.

El endpoint de reenvío y las restricciones de cuentas sin verificar siguen en la API. La interfaz ya no ofrece el acceso al reenvío; el mecanismo real se decidirá con las [opciones propuestas](OPCIONES_VERIFICACION.md). No se ha contratado ni configurado un nuevo proveedor.

El registro de una cuenta nueva también captura su mensaje en ese buzón. **Olvidé mi contraseña** captura un enlace de recuperación; al completar el cambio se revocan las sesiones anteriores. El buzón es compartido por esta instalación de demostración y muestra mensajes destinados a sus cuentas. Utiliza solo tus propios enlaces y conserva privado su acceso.

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

La app puede arrancar sin Mailpit porque el perfil es opcional. Si aparece un error al reenviar, ejecuta `docker compose ps` y comprueba que `mailpit` esté saludable. La metadata `emailDeliveryConfigured` indica un transporte configurado, no una comprobación continua de conectividad. El modo de demostración no modifica `backend/.env`: los comandos de desarrollo fuera de Docker conservan su configuración separada.

## Límites y correo real

El diálogo que consume los enlaces, las insignias de verificación y el texto de los mensajes identifican el modo de demostración. El apartado promocional del buzón se retiró del encabezado y de los formularios de acceso, registro y recuperación por petición del usuario. Ninguna cuenta se marca verificada solo por registrarse o coincidir con `itesa.edu.mx`. Hace falta consumir el enlace.

El servidor rechaza `local_demo` con `NODE_ENV=production`. No publiques este buzón ni configures reenvío a destinatarios externos. Para correo real se necesitará un proveedor SMTP o Resend, un remitente autorizado y configuración privada. Antes de usar la aplicación con estudiantes reales, separa los datos de demostración y establece una verificación real: cambiar el transporte no transforma las verificaciones locales existentes en evidencia de titularidad.

## Prueba ejecutada

La [evidencia del 12 de noviembre](correo-demo/2026-11-12/README.md) conserva resultados de frontend, API, navegador y SMTP real a Mailpit. Para repetir únicamente la comprobación SMTP en una instalación local preparada:

```powershell
Get-Content scripts/mail-demo-smoke.mjs -Raw | docker compose exec -T app node --input-type=module
```

El script se ejecuta por entrada estándar dentro de `app`, con las dependencias y configuración del contenedor. Crea un esquema PostgreSQL desechable, utiliza una cuenta sintética, comprueba captura, reenvío, uso único y recuperación, y retira solo sus propios mensajes y esquema. No imprime contraseñas ni tokens y compara el estado de los usuarios existentes antes y después.

Referencias: [imagen oficial y puertos de Mailpit](https://mailpit.axllent.org/docs/install/docker/) y [API de Mailpit](https://mailpit.axllent.org/docs/api-v1/).
