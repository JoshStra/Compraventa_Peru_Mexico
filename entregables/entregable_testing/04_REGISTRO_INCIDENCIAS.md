# Registro de incidencias en pruebas

| ID | Issue | Origen y estado observado | Verificación actual |
|---|---|---|---|
| INC-05 | [#2](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2) | Oferta retirada seguía pending. Corregida 30-10-2026. | API-OPERATIONS-06 aprobada. |
| INC-06 | [#2](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2) | DATE se devolvía con hora/zona. Corregida 30-10-2026. | API-OPERATIONS-04 aprobada. |
| ARQ-01 | [#1](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/1) | Revisión técnica de separación frontend/backend. Cerrada. | Árbol actual y build correctos. |

El issue #2 registra detección en ff48d53, pasos reproducibles y resultado histórico 27/29 (dos fallos). El comentario de cierre identifica 6b0d297 y 30/30 después de la corrección. La ejecución actual tiene 34/34 por incorporar cuatro casos de configuración; los totales históricos no se reescriben. Ambos defectos pertenecen a un único issue real, no a dos issues inventados.

El issue #1 está closed y tiene un comentario técnico. El issue #2 está closed y tiene un comentario técnico. En [github-issues.json](evidencias/github-issues.json) se conservan estados, autores, apertura, cierre y URLs; los comentarios completos están en [comentarios 1](evidencias/github-comentarios-1.json) y [comentarios 2](evidencias/github-comentarios-2.json).

La bitácora anterior docs/INCIDENT_LOG.md también registra formato de CI, servicio de archivos .data, hashchange y selectores E2E. Esas entradas no tienen un issue GitHub individual consultado; no se presentan como issues cerrados verificables en esta relación. Las capturas históricas de los issues se encuentran en ../entregable_final/evidencias/02-issue-1-cerrado.jpg y 02-issue-2-cerrado.jpg.

Incidencia de entorno de esta sesión: Docker Desktop no respondió inicialmente y su registro informó error dockerInference. No es un bug nuevo de CampusTrade. La ejecución se completó en CI. Nuevas incidencias funcionales detectadas en las 97 comprobaciones: **cero**. Esto no acredita ausencia de defectos fuera del alcance probado.
