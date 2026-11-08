# Resultados y conclusiones del testing

Resultado: **97 de 97 casos ejecutados aprobados**, cero fallidos y cero omitidos dentro de ese catálogo. Son 91 casos automatizados distintos y seis sondas HTTPS de lectura. Los casos pendientes de aceptación no se incluyen como aprobados ni como omitidos del runner. No se calcula cobertura de líneas ni un porcentaje de cumplimiento global del sistema.

| Suite | Aprobadas | Fallidas | Alcance |
|---|---|---|---|
| Frontend | 47 | 0 | 44 regresiones locales y 3 HTTP simuladas |
| API | 34 | 0 | API/PostgreSQL y configuración productiva |
| Navegador | 10 | 0 | Desktop Chrome y emulación Pixel 7 |
| Producción | 6 | 0 | Lectura HTTPS y autorización anónima |

Se comprobó persistencia entre procesos Node en API-PERSISTENCE-01, reserva concurrente en API-OPERATIONS-01 y privacidad en API-CONVERSATIONS-03. El health público devolvió database=connected. La cuenta anónima recibió 401 al consultar favoritos. El catálogo público continúa vacío; no se agregaron artículos ficticios para aparentar actividad.

Pendientes de aceptación: proveedor/remitente y entrega institucional real; publicación/subida/mensajes/operaciones productivas con cuenta verificada consentida; donación con recorrido dedicado; restauración de backup; carga/accesibilidad completa; evaluación con usuarios humanos. El proveedor de correo sigue pendiente por decisión previa del responsable, confirmado por emailDeliveryConfigured=false en PUB-06.

La validación S3 y la persistencia tras redeploy del 30-10-2026 permanecen como evidencia histórica; no se reejecutaron en este corte. Los casos actuales de imágenes API/E2E usan almacenamiento local aislado de pruebas. No se confunden con una carga HTTP de un alumno verificado en producción.

Decisión técnica: el código de la línea base pasó la regresión ejecutada. Aceptación funcional productiva completa: **PENDIENTE** de los criterios anteriores. El sistema público sigue accesible en https://campustrade-mex-per.onrender.com/.
