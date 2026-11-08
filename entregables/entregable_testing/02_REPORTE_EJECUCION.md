# Reporte de ejecución del testing

Sistema: CampusTrade 0.3.0. Fecha local: 7 de noviembre de 2026; zona America/Mexico_City. Línea base probada: `420a9bb89c91164cebc21e9e4a4a5a5173f81ff8`. Candidata desplegada v0.3.0-rc.2 sobre e4b14ff; el commit 420a9bb solo agregó el cierre documental. No hubo cambios al código de aplicación durante esta evaluación.

La reejecución [GitHub Actions intento 2](https://github.com/JoshStra/Compraventa_Peru_Mexico/actions/runs/41135024269/job/128585456662) empezó 2026-11-07 19:07:59 UTC-06 y terminó 19:09:12 UTC-06 con **success**. Usó Ubuntu, Node 24, PostgreSQL 17 y Chromium. Los logs originales usan UTC del 8 de noviembre; corresponden a la noche del 7 en México. Los casos registran ambos husos.

| Grupo | Casos distintos | Resultado | Evidencia |
|---|---|---|---|
| Frontend | 47 (44 prototipo y 3 cliente HTTP) | 47 aprobadas | frontend.json / frontend.log |
| API y configuración | 34 | 34 aprobadas | api-ci.log |
| Navegador | 10 (5 recorridos por 2 tamaños) | 10 aprobadas | navegador-ci.log |
| HTTPS público de solo lectura | 6 | 6 aprobadas | produccion-lectura.json |

Secuencia ejecutada: npm run format:check, npm test, npm run test:api, npm run build, instalación del Chromium compatible y npm run test:e2e. Los 47 casos frontend y el build también se repitieron localmente en Windows. No se suman dos veces. Las verificaciones de lectura del sitio público no crean cuentas ni alteran publicaciones.

Se revisaron los tests existentes y se construyó un catálogo con identificadores estables. API/E2E usan esquemas PostgreSQL aislados y cuentas campus.test; sus helpers rechazan bases remotas. Los enlaces de verificación se obtienen de un transporte de pruebas, sin enviar correo institucional. Los roles administrativos de fixtures no existen como ruta productiva.

Docker Desktop presentó un error de arranque en dockerInference en este equipo. La CLI posteriormente informó inicio, pero la verificación completa de API/navegador se realizó en CI y se registra en ese entorno. No se modificó la instalación de Docker para producir una aprobación local artificial.

No se ejecutaron pruebas de carga, pentest, auditoría WCAG integral, entrega real de correo, restauración de respaldos ni sesiones con personas usuarias. El reporte de evaluación enumera estas restricciones. Las capturas del entregable anterior son históricas del 30 de octubre y no se presentan como capturas de esta ejecución.
