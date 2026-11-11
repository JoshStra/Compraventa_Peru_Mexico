# 7. Cambios posteriores al feedback (commits)

| Commit | Fecha real de Git | Cambio |
| --- | --- | --- |
| 2075900 | 2026-11-11T09:01:32-06:00 | feat(ui): aplica diseño minimalista con buscador y navegación móvil |
| 9045e92 | 2026-11-10T17:00:14-06:00 | feat(ui): aplica diseño de campus y corrige navegación accesible |
| 29d7101 | 2026-11-10T09:55:45-06:00 | fix(security): corrige cinco fallas y valida 113 pruebas |
| 6d56a90 | 2026-11-10T10:39:45-06:00 | feat(docker): ejecuta CampusTrade con PostgreSQL e imagenes persistentes |
| 664f416 | 2026-11-09T19:28:17-06:00 | fix: evita recorte de filtros en pantallas estrechas |

2075900 implementa la guía minimalista, la búsqueda global, filtros y chips, navegación móvil, ficha y chat adaptables. Incluye las cuatro correcciones del issue #5 y las regresiones que se reejecutaron en este corte. 9045e92 es el incremento visual anterior; 29d7101 corresponde a seguridad y 6d56a90 a Docker con PostgreSQL e imágenes persistentes. 664f416 conserva la corrección histórica de filtros #4.

Se conserva el repositorio origin y su historial. La rama actual es codex/minimal-buscador-2026-11-11. No se alteraron fechas ni se crearon commits vacíos. El código ya estaba confirmado en 2075900 antes de esta actualización documental; la entrega de Word y sus evidencias se guarda en un commit documental posterior.

No se ejecuta push en esta entrega. Un commit local y un issue publicado en GitHub son evidencias distintas. No se atribuye al remoto el diseño que solo está confirmado y aplicado localmente.
