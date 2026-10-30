# Pruebas y límites de la verificación

Entorno real del 2026-10-30: Windows, Node 24.12.0, PostgreSQL 17 en Docker, React/Vite compilados, Chromium headless. CI ejecuta Ubuntu/Node 24/PostgreSQL 17 y Playwright. Las pruebas de API/browsers rechazan PostgreSQL remoto y crean esquemas únicos desechables, sin modificar alumnos reales.

| Comando              | Alcance y resultado final esperado de esta entrega                                                                                                                                                             | Evidencia                   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| npm test             | 47 pruebas: 44 de regresión del prototipo explícito y 3 del cliente HTTP. No atribuir las 44 a integración de servidor.                                                                                        | pruebas-frontend.txt        |
| npm run test:api     | 30 pruebas de API contra PostgreSQL real: tokens, permisos, validación, imágenes, mensajes, concurrencia, moderación y persistencia entre procesos.                                                            | pruebas-api.txt             |
| npm run build        | Compilado productivo Vite, modo HTTP predeterminado.                                                                                                                                                           | compilacion.txt             |
| npm run test:e2e     | 5 recorridos × escritorio y Pixel 7 = 10 pruebas. Registro/verificación aislada, imagen/publicación/edición, favoritos, bloqueo sin verificar, chat de dos usuarios + venta/calificación y reporte/resolución. | pruebas-navegador.txt y PNG |
| npm run format:check | Formato del repositorio.                                                                                                                                                                                       | formato.txt                 |
| npm audit --omit=dev | Dependencias de ejecución; resultado en log, sin prometer ausencia de futuras vulnerabilidades.                                                                                                                | dependencias.txt            |

Logs en [evidencias](../entregables/entregable_final/evidencias/). CI comprobado de la interfaz: [ff48d53](https://github.com/JoshStra/Compraventa_Peru_Mexico/actions/runs/41093113611). El estado posterior se conserva en el resumen de entrega y Actions.

Para repetir: preparar .env seguros, `docker compose up -d db`, `npm ci`, `npm run migrate`, ejecutar los comandos. Instalar Chromium con `npx playwright install chromium` desde frontend si hace falta. En este equipo se usó PLAYWRIGHT_BROWSERS_PATH=.playwright; no es requisito del producto. El servidor E2E solo escucha loopback y sus rutas de fixture no existen en server.js productivo.

Se comprobaron foco y cierre de modales en las regresiones existentes, formularios etiquetados y ausencia de desbordamiento horizontal en recorridos seleccionados. Las capturas se inspeccionaron visualmente. Esto no es auditoría WCAG completa, pentest, prueba de carga ni envío real de correo. Donación, S3 externo, recuperación de backup y despliegue HTTPS requieren validación adicional. Las incidencias previas y correcciones están en INCIDENT_LOG.md.
