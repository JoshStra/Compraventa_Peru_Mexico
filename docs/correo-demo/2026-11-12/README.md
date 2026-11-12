# Validación de correo local · 12 de noviembre de 2026

Incremento realizado desde el punto de partida limpio `ccf0cb1`, en `codex/correo-demo-local-2026-11-12`. Se agregó correo de demostración con Mailpit a Docker y avisos explícitos en registro, verificación, recuperación, perfiles y administración. No se habilitó entrega al correo real de ITESA.

## Resultados

| Alcance                    | Resultado                                                                         | Evidencia                          |
| -------------------------- | --------------------------------------------------------------------------------- | ---------------------------------- |
| Frontend                   | 57 aprobadas; incluye dos pruebas del aviso y enlace al buzón                     | [frontend.txt](frontend.txt)       |
| API con PostgreSQL aislado | 54 aprobadas; incluye modo demo, configuración, uso único y rechazo en producción | [api.txt](api.txt)                 |
| Navegador                  | 26 aprobadas en escritorio y móvil; regresión de flujos completos                 | [e2e.txt](e2e.txt)                 |
| Compilación                | Vite completado                                                                   | [build.txt](build.txt)             |
| SMTP real a Mailpit        | Cinco comprobaciones aprobadas, con esquema y mensajes sintéticos retirados       | [smtp-smoke.json](smtp-smoke.json) |
| Docker y archivos servidos | App, PostgreSQL y Mailpit saludables; cuatro assets coinciden con el compilado    | [runtime.json](runtime.json)       |

Total de regresión: **137 pruebas aprobadas**. Las cinco comprobaciones SMTP son adicionales. La línea `INTERNAL_ERROR` de API corresponde a la prueba deliberada SEC-11 de errores seguros; el resultado de la suite es cero fallos. Las advertencias de color de Playwright no son fallos.

Las pruebas API y E2E conservan su transporte aislado. El script SMTP usa el transporte Nodemailer real de la configuración Docker y un esquema aleatorio `test_mail_*`. Su cuenta es sintética y no representa un alumno. Se comprobó registro sin verificación automática, sustitución del token al reenviar, rechazo del enlace anterior y del reutilizado, captura de recuperación y revocación de la sesión al cambiar la contraseña. Un hash de los identificadores, roles, estados de verificación y suspensión de `public.users` coincidió antes y después; no se publica ese contenido.

La [revisión de formato](format-check.txt) aprobó todos los archivos aplicables. La [revisión acotada de secretos](security-summary.json) encontró cero coincidencias en el texto del árbol, compilado y referencias Git locales. Excluye binarios y archivos mayores de 3 MB; no es una certificación de seguridad.

## Revisión visual y de ejecución

- [CampusTrade con aviso de demostración](campustrade-demo.jpg): revisión a 1280 px sin desbordamiento horizontal.
- [Acceso en celular](acceso-320.jpg): revisión a 320 px, documento de 320 px y diálogo de 288 px; aviso legible y enlace accesible.
- [Buzón Mailpit](buzon-mailpit.jpg): vacío después de retirar los mensajes sintéticos, listo para los del usuario.

Se conservaron `campustrade_postgres_data` y `campustrade_images_data`; se añadió únicamente el volumen del buzón. Todas las publicaciones de puertos de estos servicios usan loopback y SMTP 1025 no se publica al host. La respuesta de sesión indica `local_demo`, transporte configurado y URL local del buzón. El registro de ejecución no contiene cookies, CSRF, contraseñas ni enlaces de verificación.

La asignación administrativa individual fue expresamente autorizada, conservó el estado sin verificar y dejó un evento `admin_assigned_pending_verification` en la auditoría de la base local. No se publican datos de la cuenta. La herramienta normal de promoción conserva su requisito de correo verificado. La prueba SMTP no completó enlaces ni cambió contraseñas de usuarios existentes.

## Reproducción y alcance

```powershell
npm test
npm run test:api
npm run build
npm run test:e2e
Get-Content scripts/mail-demo-smoke.mjs -Raw | docker compose exec -T app node --input-type=module
npm run format:check
```

Las instrucciones de uso están en [CORREO_DEMO.md](../../CORREO_DEMO.md). Los logs se copiaron de las ejecuciones conservando resultados y tiempos, normalizando saltos de línea y sustituyendo la ruta del repositorio por `<REPO>`. Las fechas y horas son las reales de las herramientas. [checksums.sha256](checksums.sha256) permite comprobar los archivos de esta evidencia.

Este incremento no reactiva servicios de nube ni cambia el repositorio `origin`. La documentación de testing del 11 de noviembre conserva su corte histórico. La demostración local no prueba acceso al correo institucional ni sustituye una evaluación con alumnos reales.
