# 6. Evaluación funcional del sistema

| Requisito | Funcionalidad | Casos | Evaluación |
| --- | --- | --- | --- |
| RF-01 | Registro y sesión | API-AUTH-01/02/04; API-SEC-01/05/12/15/16 | Aprobada en el entorno de pruebas. |
| RF-02 | Verificación institucional | API-AUTH-03; API-SEC-13/16; E2E-*-06/08 | Parcial: tokens y dominio comprobados; envío real pendiente. |
| RF-03 | Perfil | FE-HEADER-03; E2E-*-04/06 | Aprobada con cuentas sintéticas. |
| RF-04 | Publicar y editar | API-LISTINGS-01/02/03; E2E-*-06/08 | Aprobada; la cuenta pendiente sigue bloqueada. |
| RF-05 | Modalidades y operaciones | API-OPERATIONS-01 a 06; API-SEC-03/04; E2E-*-05/11/12 | Venta, renta e intercambio probados; donación visible, sin cierre E2E dedicado. |
| RF-06 | Búsqueda | FE-HEADER-01; FE-NAV-01/02; E2E-*-02/05 | Aprobada con fixtures; consulta en encabezado y URL. |
| RF-07 | Filtros | FE-NAV-04/05; E2E-*-01/05/09 | Aprobada con chips, limpieza y error accesible. |
| RF-08 | Detalle e imágenes | API-LISTINGS-05; API-SEC-02/09; E2E-*-05/06 | Aprobada; detalle móvil y selección de imagen. |
| RF-09 | Mensajes | API-CONVERSATIONS-01 a 03; E2E-*-10/12 | Aprobada entre dos sesiones; consulta periódica. |
| RF-10 | Favoritos | API-LISTINGS-04; E2E-*-07 | Aprobada entre sesiones. |
| RF-11 | Calificaciones | API-OPERATIONS-02; E2E-*-12 | Aprobada después de finalizar. |
| RF-12 | Reportes | API-MODERATION-01/02; E2E-*-13 | Aprobada con resolución registrada. |
| RF-13 | Entrega en campus | API-CONVERSATIONS-02; E2E-*-12 | Coordinación por mensajes y punto de entrega; sin GPS ni pagos. |
| RF-14 | Administración | API-MODERATION-01 a 05; E2E-*-04/13 | Aprobada con rol administrador de pruebas. |

El asterisco E2E-* representa desktop y mobile. Las referencias remiten a las fichas completas de esta edición y a casos_ejecutados.json.

Criterio de entrada: código compilable, base local aislada y fixtures disponibles. Criterio de salida técnico: casos aprobados, defectos revalidados, evidencias legibles y despliegue Docker saludable. Cumplido en el alcance evaluado.

El dominio itesa.edu.mx se compara completo: se rechazan sufijos parecidos, subdominios y Gmail; se normalizan mayúsculas y espacios sin verificar automáticamente la cuenta. El proveedor de correo sigue pendiente por decisión del responsable.

La aceptación con alumnos reales no se realizó. El indicador de mensajes nuevos es local a este navegador, no sincroniza lecturas entre dispositivos ni confirma lectura del destinatario. Privacidad, ayuda y contacto esperan contenido aprobado. No se integran pagos ni carrito; los acuerdos económicos son externos al sistema.
