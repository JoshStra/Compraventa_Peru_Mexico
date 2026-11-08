# Evaluación funcional de CampusTrade

La evaluación relaciona requisitos RF-01 a RF-14 con los casos ejecutados. Aprobación técnica de una prueba en CI significa que sus aserciones se cumplieron en ese entorno; no acredita por sí sola aceptación por estudiantes ni operación productiva de cada flujo.

| Requisito | Funcionalidad | Casos representativos | Evaluación |
|---|---|---|---|
| RF-01 | Registro e inicio de sesión | API-AUTH-01, API-AUTH-02 | Aprobada en el entorno de pruebas |
| RF-02 | Verificación universitaria | API-AUTH-01, API-AUTH-02 | Parcial: correo real pendiente |
| RF-03 | Perfil de estudiante | API-LISTINGS-03, E2E-DESKTOP-01 | Aprobada en el entorno de pruebas |
| RF-04 | Publicar artículo | API-LISTINGS-01, API-LISTINGS-02 | Aprobada en el entorno de pruebas |
| RF-05 | Venta renta intercambio y donación | API-OPERATIONS-01, API-OPERATIONS-02 | Venta/renta/intercambio probados; donación sin E2E dedicado |
| RF-06 | Buscador visible | API-LISTINGS-02, E2E-DESKTOP-02 | Aprobada en el entorno de pruebas |
| RF-07 | Filtros combinados | API-LISTINGS-02, API-MODERATION-05 | Aprobada en el entorno de pruebas |
| RF-08 | Detalle del artículo | API-LISTINGS-05, E2E-DESKTOP-01 | Aprobada en el entorno de pruebas |
| RF-09 | Mensajería privada | API-CONVERSATIONS-01, API-CONVERSATIONS-02 | Aprobada en el entorno de pruebas |
| RF-10 | Favoritos | API-LISTINGS-04, E2E-DESKTOP-02 | Aprobada en el entorno de pruebas |
| RF-11 | Calificaciones | API-OPERATIONS-02, E2E-DESKTOP-04 | Aprobada en el entorno de pruebas |
| RF-12 | Reportes | API-MODERATION-01, API-MODERATION-02 | Aprobada en el entorno de pruebas |
| RF-13 | Entrega dentro del campus | API-CONVERSATIONS-02, E2E-DESKTOP-04 | Aprobada en el entorno de pruebas |
| RF-14 | Gestión del sistema | API-MODERATION-01, API-MODERATION-02 | Aprobada en el entorno de pruebas |

Criterio de entrada: código compilable, base aislada, fixtures sintéticos y runners existentes. Criterio de salida técnico: casos seleccionados ejecutados sin fallos, logs legibles, bugs históricos revalidados y health público correcto. Se cumplieron. Criterio de salida de aceptación: correo institucional entregado y verificado con consentimiento, operación productiva real y feedback de personas. No se ha cumplido.

RF-13 acredita coordinación por texto y punto de entrega, sin GPS ni pagos. Las pantallas móviles corresponden a emulación Pixel 7, no a un ensayo físico en un teléfono. La mensajería usa consulta periódica; no se afirma comunicación WebSocket. No se afirma una auditoría completa de accesibilidad.
