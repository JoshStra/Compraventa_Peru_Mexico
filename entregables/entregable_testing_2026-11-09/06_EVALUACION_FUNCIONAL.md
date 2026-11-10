# 6 Evaluación funcional del sistema

La evaluación relaciona los catorce requisitos con casos identificables y separa las pruebas locales de los recorridos productivos. Gestión es el panel integrado del rol administrador; la evidencia local conserva reportes resueltos, usuarios y catálogos sin crear administradores artificiales en producción.

| Requisito | Funcionalidad | Casos representativos | Evaluación |
| --- | --- | --- | --- |
| RF-01 | Registro y sesión | API-AUTH-01/02/04 | Aprobada en pruebas; dominio productivo comprobado |
| RF-02 | Verificación universitaria | API-AUTH-01/03 y PROD-02 | Parcial: tokens aislados correctos; correo real pendiente |
| RF-03 | Perfil | API-LISTINGS-03 y E2E-DESKTOP-01 | Aprobada con cuentas sintéticas |
| RF-04 | Publicar y editar | API-LISTINGS-01/02/05 y E2E-DESKTOP-01 | Aprobada en entorno local conectado |
| RF-05 | Venta renta intercambio donación | API-OPERATIONS-01 a 06 | Venta/renta/intercambio probados; donación sin E2E dedicado |
| RF-06 | Búsqueda | API-LISTINGS-02 y E2E-DESKTOP-06 | Aprobada con fixtures; producción sin inventario |
| RF-07 | Filtros | API-LISTINGS-02 y E2E-MOBILE-06 | Aprobada; revalidada a 320 px tras #4 |
| RF-08 | Detalle e imágenes | API-LISTINGS-05 y E2E-DESKTOP-01 | Aprobada; imagen de portada editorial identificada |
| RF-09 | Mensajes privados | API-CONVERSATIONS-01 a 03 y E2E-DESKTOP-04 | Aprobada entre sesiones sintéticas |
| RF-10 | Favoritos | API-LISTINGS-04 y E2E-DESKTOP-02 | Aprobada con persistencia PostgreSQL |
| RF-11 | Calificaciones | API-OPERATIONS-02 y E2E-DESKTOP-04 | Aprobada tras operación finalizada |
| RF-12 | Reportes | API-MODERATION-01/02 y E2E-DESKTOP-05 | Aprobada con resolución y comentario |
| RF-13 | Entrega en campus | API-CONVERSATIONS-02 y E2E-DESKTOP-04 | Coordinación por texto y punto de entrega; sin GPS ni pagos |
| RF-14 | Gestión del sistema | API-MODERATION-01 a 05 y E2E-MOBILE-05 | Aprobada en entorno local con rol administrador |

Criterio de entrada: código compilable, PostgreSQL aislado, fixtures y runners disponibles. Criterio de salida técnico: casos seleccionados aprobados, correcciones revalidadas, logs legibles y health público correcto. Se cumplió después de resolver #3 y #4.

La aceptación completa sigue pendiente del proveedor y remitente de correo, una cuenta institucional consentida y sesiones con estudiantes reales. También quedan fuera de este corte restauración de respaldos, carga sostenida, dispositivos físicos y una operación productiva consentida de extremo a extremo. No se afirma una revisión independiente por pull request.

El rediseño se evaluó en portada, catálogo, acceso y móvil. Los recorridos E2E actuales cubren perfil, imágenes, favoritos, mensajes, operaciones, calificación y Gestión. La imagen editorial no representa una publicación real. El resultado productivo no implica que exista inventario, ya que el catálogo público observado estaba vacío.
