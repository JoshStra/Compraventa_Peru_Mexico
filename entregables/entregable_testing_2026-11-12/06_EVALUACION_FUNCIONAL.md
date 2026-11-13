# 6 Evaluación funcional del sistema

CampusTrade permite registrarse, iniciar sesión y usar catálogo, publicaciones, mensajes y operaciones sin confirmar el correo. La administración conserva un rol separado. La siguiente matriz relaciona funciones con casos ejecutados y sus límites.

| Requisito | Función | Casos | Evaluación |
| --- | --- | --- | --- |
| RF-01 | Registro y sesión | API-AUTH-00/01/02/04; API-SEC-01/05/12/15/16; SMTP-01 | Aprobada con dominio exacto y contraseña; sin confirmar buzón. |
| RF-02 | Confirmación de correo | API-AUTH-03; E2E-*-08 | Retirada por solicitud del responsable; no aplica como función activa. |
| RF-03 | Perfil | FE-HEADER-03; E2E-*-04/06/08 | Datos y edición conservados; sin insignias de verificación. |
| RF-04 | Publicaciones | API-LISTINGS-01/02/03; E2E-*-06; SMTP-02 | Aprobada con cuenta registrada sin confirmación y permisos propios. |
| RF-05 | Modalidades y operaciones | API-OPERATIONS; API-SEC-03/04; E2E-*-05/11/12 | Venta, renta e intercambio probados; donación creada en SMTP, sin cierre E2E dedicado. |
| RF-06 | Búsqueda | FE-HEADER-01; FE-NAV-01/02; E2E-*-02/05 | Aprobada con consulta en encabezado y persistencia en URL. |
| RF-07 | Filtros | FE-NAV-04/05; E2E-*-01/05/09 | Aprobada con chips, limpieza y rangos accesibles. |
| RF-08 | Detalle e imágenes | API-LISTINGS-05; API-SEC-02/09; E2E-*-05/06 | Aprobada con validación y normalización de imágenes. |
| RF-09 | Mensajes | API-CONVERSATIONS; E2E-*-10/12; DOCKER-06 | Aprobada entre dos sesiones sin confirmación, con privacidad. |
| RF-10 | Favoritos | API-LISTINGS-04; E2E-*-07 | Aprobada entre sesiones y recargas. |
| RF-11 | Calificaciones | API-OPERATIONS-02; E2E-*-12; DOCKER-06 | Aprobada tras completar la operación. |
| RF-12 | Reportes | API-MODERATION; E2E-*-13 | Reporte y resolución con comentario persistentes. |
| RF-13 | Persistencia | API-PERSISTENCE; DOCKER-08 | Sesión, artículo, imagen y mensajes sobreviven a recrear contenedores. |
| RF-14 | Administración | API-MODERATION; E2E-*-04/13 | Rol explícito y permisos conservados; sin promoción automática. |

La coincidencia con itesa.edu.mx no demuestra control del buzón ni pertenencia institucional. Ese alcance fue aceptado al retirar la confirmación. Se conservan contraseñas, límites, CSRF, suspensión y autorización de recursos.

Recuperación de contraseña: aprobada en API y SMTP local; el envío a un correo real sigue sin proveedor configurado. Pagos en línea: fuera del alcance implementado, las entregas se acuerdan en el campus. Acceso público: no evaluado como despliegue activo; Render continúa suspendido y la aplicación funciona en Docker local. La evaluación con estudiantes externos y las pruebas de carga permanecen pendientes.
