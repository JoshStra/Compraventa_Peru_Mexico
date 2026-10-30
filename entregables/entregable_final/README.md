# CampusTrade — entrega final comprobable

Corte: 2026-10-30. Equipo 3 MEX-PER. Código integrado en origin/main; candidato 0.3.0. Despliegue real HTTPS en Render Free, Neon Free y Supabase Free. Correo real pendiente por decisión del responsable.

## Siete apartados

1. [AVANCE_BACKLOG](01_AVANCE_BACKLOG.md)
2. [ISSUES_CERRADOS](02_ISSUES_CERRADOS.md)
3. [LOGS_INCIDENCIAS](03_LOGS_INCIDENCIAS.md)
4. [ESTRUCTURA_FUNCIONAL](04_ESTRUCTURA_FUNCIONAL.md)
5. [COLABORACION_REPOSITORIO](05_COLABORACION_REPOSITORIO.md)
6. [REVISIONES_PR](06_REVISIONES_PR.md)
7. [RELEASES_DESPLIEGUE](07_RELEASES_DESPLIEGUE.md)

## Estado de la rúbrica

| Criterio | Estado | Justificación / evidencia |
|---|---|---|
| 1. Avance del backlog | CUMPLIDO | RF-01 a RF-14, historias, dependencias, criterios, responsables verificables y cronograma real en 01. |
| 2. Issues cerrados | CUMPLIDO | #1 y #2 cerrados con comentario técnico, commit y regresiones; 02 y capturas. |
| 3. Logs e incidencias | CUMPLIDO | Bitácora, fallos reales y validaciones positivas/negativas; 03 y logs. |
| 4. Estructura funcional | CUMPLIDO | Árbol real, componentes, flujo y ER de las migraciones; 04. |
| 5. Repositorio colaborativo | CUMPLIDO | Origin compartido, dos cuentas contribuyentes y conversación verificable; 05. No acredita revisión independiente. |
| 6. PR revisados | PENDIENTE | Cero PR; revisión real de otro integrante por realizar. La comprobación de issues sí está completa. |
| 7. Releases y despliegue | CUMPLIDO | Sistema público HTTPS en Render Free con Neon y S3 privado; health 200, pruebas y capturas auténticas en 07. El correo permanece pendiente. |

Documento principal: [ENTREGABLE_FINAL.md](ENTREGABLE_FINAL.md). [Google Docs creado y verificado](https://docs.google.com/document/d/1h3fI6tzXEtdbv4iEQHsKf1KkHpNK_m08HOVxQkKW9W8/edit), guardado en la carpeta ChatGPT del Drive conectado. [Release v0.3.0-rc.1 publicado](https://github.com/JoshStra/Compraventa_Peru_Mexico/releases/tag/v0.3.0-rc.1) el 30-10-2026 a las 17:07:25Z, tag sobre `addc154`. [PDF verificado](CampusTrade_Entregable_Final.pdf). [Repositorio](https://github.com/JoshStra/Compraventa_Peru_Mexico), [commits](https://github.com/JoshStra/Compraventa_Peru_Mexico/commits/main/), [issues cerrados](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues?q=is%3Aissue+is%3Aclosed). Frontend y API: [CampusTrade público](https://campustrade-mex-per.onrender.com/), [health](https://campustrade-mex-per.onrender.com/api/v1/health).

## Evidencias

Las capturas desktop/mobile corresponden a localhost, Chromium, PostgreSQL y cuentas sintéticas campus.test. Las capturas JPG del repositorio/commits/issues/PR proceden de GitHub real. Los logs no contienen contraseñas ni tokens. Las [capturas de despliegue](evidencias/despliegue/) proceden del sistema remoto real; sigue pendiente una revisión auténtica por PR. [Pruebas y límites](../../docs/TESTING.md).

El registro de publicación posterior al tag agrega enlaces, captura del release y la exportación actualizada del documento; no cambia el código probado ni mueve el tag. [Registro verificable](evidencias/estado-publicacion.json). [Captura del release](evidencias/07-release-candidata.jpg), sin presentarlo como despliegue.
