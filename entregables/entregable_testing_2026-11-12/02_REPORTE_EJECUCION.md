# 2 Reportes de testing

CampusTrade 0.3.0, código 0274f2b98a376ee67116fd5898ea1c9d14d63092, rama codex/sin-confirmacion-correo-2026-11-12. Las ejecuciones corresponden al 12 de noviembre de 2026 en America/Mexico_City, UTC menos seis horas. Los logs UTC del 13 de noviembre corresponden a esa misma noche local.

| Grupo | Casos | Inicio UTC | Fin UTC |
| --- | --- | --- | --- |
| Frontend | 57 | 2026-11-13T04:43:51.213Z | 2026-11-13T04:44:09.940Z |
| API | 54 | 2026-11-13T04:43:55.013Z | 2026-11-13T04:44:27.623Z |
| Navegador | 26 | 2026-11-13T04:45:07.421Z | 2026-11-13T04:46:03.563Z |

Frontend utiliza Vitest y JSDOM en ocho archivos. Incluye componentes, cliente HTTP y dominio, además de pruebas del prototipo local explícito. Las pruebas del prototipo no sustituyen la evaluación de la API conectada.

API utiliza Node 24 y PostgreSQL 17 con esquemas temporales aislados. Comprueba registro directo, autenticación, permisos, imágenes, concurrencia, operaciones, moderación y dieciséis casos de seguridad. Su transporte de recuperación se sustituye por memoria.

Navegador utiliza Chromium de la caché del proyecto, dos workers y configuraciones de escritorio y Pixel 7 emulado. Algunos escenarios fuerzan 320 px. El servidor de pruebas escucha en loopback 4180 y utiliza una clave temporal; no se ejecuta dentro de la aplicación local de uso normal.

Docker agrega nueve comprobaciones sobre contenedores, rol de base, persistencia e integración con volúmenes propios. SMTP agrega cinco comprobaciones usando Nodemailer y Mailpit reales, con esquema desechable y conservación de usuarios existentes. Los logs JSON registran sus fechas exactas.

Evidencias primarias: frontend.json, api.xml, navegador.json, docker-smoke.json y smtp-smoke.json, con logs y metadatos de ejecución. Se retiraron únicamente rutas locales y la clave temporal E2E. La ruta de api.xml se representa como REPO para conservar XML válido; no se alteraron resultados ni duraciones.
