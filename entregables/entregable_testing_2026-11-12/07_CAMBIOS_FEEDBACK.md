# 7 Cambios posteriores al feedback

El código evaluado 0274f2b está publicado en origin/codex/sin-confirmacion-correo-2026-11-12. Se verificó el SHA remoto sin push forzado. La rama main conserva su historial; la publicación en una rama de colaboración no equivale a una fusión ni a un despliegue público.

| Commit | Fecha real de Git | Implementación o validación |
| --- | --- | --- |
| [29d7101](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/29d7101a5a9c45d4bb1c8125df6418420ad9c883) | 2026-11-10T09:55:45-06:00 | fix(security): corrige cinco fallas y valida 113 pruebas |
| [6d56a90](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6d56a90c9c5e83f48668e6f89e227e75517b3260) | 2026-11-10T10:39:45-06:00 | feat(docker): ejecuta CampusTrade con PostgreSQL e imagenes persistentes |
| [586d156](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/586d15691690e32c6ea367491bb366eeda807d1d) | 2026-11-10T10:52:53-06:00 | docs(deploy): registra la migracion local y suspension de Render |
| [9045e92](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/9045e926d424de98ac4f32a4346e8ad8ee3fc9b2) | 2026-11-10T17:00:14-06:00 | feat(ui): aplica diseño de campus y corrige navegación accesible |
| [2075900](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/20759004c4448e588f6b80e89dc6c127b399198c) | 2026-11-11T09:01:32-06:00 | feat(ui): aplica diseño minimalista con buscador y navegación móvil |
| [ccf0cb1](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/ccf0cb1352d2ff93742a3df1a2dc0968fd626b0a) | 2026-11-11T10:30:24-06:00 | docs(testing): actualiza entrega Word con 131 pruebas y evidencias |
| [4f7a547](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/4f7a5470fe754a76e2f8406d7ef7007159ada3c8) | 2026-11-12T17:55:45-06:00 | feat(mail): habilita buzón local de demostración |
| [6c62c63](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6c62c63ff87b2f999bf7e35529b2189fb3bacdcf) | 2026-11-12T18:11:42-06:00 | fix(ui): retira el apartado visible del buzón de pruebas |
| [3341d8c](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/3341d8c3bc5223385434efaf4cf14e2039204149) | 2026-11-12T20:12:16-06:00 | fix(ui): elimina el apartado de verificación del perfil |
| [0274f2b](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/0274f2b98a376ee67116fd5898ea1c9d14d63092) | 2026-11-12T21:08:08-06:00 | feat(auth): retira la confirmación de correo del registro |

El feedback del responsable motivó retirar primero el apartado visible y después el requisito de confirmación en la API. Los commits 6c62c63 y 3341d8c retiraron elementos de interfaz; 0274f2b retiró el requisito completo y preservó la recuperación. El issue #6 relaciona la decisión con la implementación y sus regresiones.

Las fechas son las generadas por Git. No se crearon commits vacíos ni se alteraron horarios. Los documentos de esta entrega se guardan después de la revisión visual en un commit documental posterior; el historial de la rama permite identificar su versión. Los resultados técnicos se refieren al código 0274f2b, cuyo contenido de aplicación no cambia al añadir los documentos.
