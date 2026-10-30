# CampusTrade

Aplicación universitaria para venta, renta, intercambio y donación de materiales académicos. La versión 0.3.0 conserva React 18 y Vite y conecta la interfaz a una API Node.js con PostgreSQL. Las entregas se acuerdan dentro del campus; no se integran pagos en línea.

## Preparación local

Requiere Node.js 24, npm y Docker con el motor iniciado.

1. Ejecuta `npm ci` desde la raíz.
2. Copia `.env.example` a `.env` y `backend/.env.example` a `backend/.env`.
3. Genera contraseñas aleatorias locales y una clave APP_SECRET de al menos 32 caracteres. Usa la misma contraseña PostgreSQL en ambos archivos, sin subirlos a Git.
4. Mantén `ALLOWED_EMAIL_DOMAINS=itesa.edu.mx`, dominio confirmado para este proyecto. Configura el transporte de correo antes de verificar cuentas reales.
5. Inicia la base y aplica las migraciones:

```bash
docker compose up -d db
npm run migrate
npm run build
npm start
```

Abre la URL que imprime el servidor, normalmente http://127.0.0.1:3000. Node sirve la API y `frontend/dist/` desde el mismo origen. `iniciar-dev.cmd` revisa dependencias, compila e inicia ese servidor; PostgreSQL y los archivos de configuración deben estar preparados.

Para desarrollar con recarga, usa dos terminales: `npm run dev:api` y `npm run dev`. Vite reenvía `/api` al backend local en el puerto 3000.

## Estado comprobado

- API con cuentas, sesiones revocables, CSRF, verificación por enlace y recuperación de contraseña.
- Catálogo paginado, búsqueda, filtros, publicaciones autorizadas, imágenes de hasta 5 MB y favoritos persistentes.
- API de conversaciones privadas, operaciones transaccionales, rentas, intercambios, calificaciones, reportes y administración.
- Interfaz conectada para registro, login, verificación, perfil, catálogo, creación y edición, imágenes, favoritos y reportes. Las pantallas de mensajería, operaciones y gestión se integran en el siguiente incremento.

La cuenta se crea sin verificar y necesita el enlace enviado a su correo. El dominio por sí solo no concede una insignia. El envío real queda pendiente de configurar Resend o SMTP y un remitente autorizado. Las pruebas usan cuentas campus.test y un transporte aislado; no verifican estudiantes reales.

## Validación

```bash
npm test
npm run test:api
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
```

Las pruebas de API y navegador requieren PostgreSQL local. Cada ejecución full stack crea un esquema separado y cuentas sintéticas; el servidor de pruebas solo escucha en loopback, exige una clave de ejecución y no forma parte de la aplicación productiva. Los recorridos usan el compilado real, cookies de sesión y datos PostgreSQL.

El prototipo anterior sigue en AppShell como demostración explícita con `VITE_DEMO_MODE=true`. No se usa como sustituto de una API ausente y no es el modo predeterminado. Sus pruebas de regresión se conservan.

## Documentación

- [Auditoría inicial](docs/AUDITORIA_INICIAL.md)
- [Contrato de API](docs/API.md)
- [Base de datos y migraciones](docs/DATABASE.md)
- [Seguridad y activaciones pendientes](docs/SECURITY.md)
- [Backlog](docs/BACKLOG.md)

El despliegue anterior de páginas estáticas se retiró porque no publica el backend ni PostgreSQL. La publicación de esta versión requiere servicios reales, credenciales configuradas y verificación HTTPS; compilar no equivale a desplegar. No se ha contratado ningún servicio de pago.
