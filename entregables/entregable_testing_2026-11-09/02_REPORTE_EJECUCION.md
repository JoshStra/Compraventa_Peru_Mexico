# 2 Reporte de ejecución

CampusTrade es una aplicación React con API Express, PostgreSQL y almacenamiento de imágenes externo en producción. Esta revisión incorpora la galería blanca, los botones azul/neutro, la imagen editorial, el catálogo y los paneles rediseñados, además de las correcciones de React y filtros móviles detectadas al actualizar la entrega.

Se conservó el repositorio origin y el punto de partida 4a98809, que estaba limpio. Las pruebas se ejecutaron antes de crear cada commit corrector. Los metadatos conservan el HEAD previo; el árbol probado incluía las modificaciones que posteriormente quedaron en 4f1927c y 664f416. API y frontend no se volvieron a contar al repetir suites. No se declara una ejecución nueva en GitHub Actions para este corte.

## Ejecuciones seleccionadas

| Grupo | Inicio México | Fin México | Salida | Log |
| --- | --- | --- | --- | --- |
| Frontend | 09-11-2026 19:20:03 UTC-06 | 09-11-2026 19:20:11 UTC-06 | 0 | evidencias/frontend.txt |
| API y configuración | 09-11-2026 19:17:17 UTC-06 | 09-11-2026 19:17:33 UTC-06 | 0 | evidencias/api.txt |
| Navegador | 09-11-2026 19:26:55 UTC-06 | 09-11-2026 19:27:23 UTC-06 | 0 | evidencias/e2e.txt |
| Compilación | 09-11-2026 19:26:54 UTC-06 | 09-11-2026 19:26:55 UTC-06 | 0 | evidencias/build.txt |

## Resultado y trazabilidad

Frontend: 47 de 47. API/configuración: 34 de 34. Navegador: 12 de 12. Producción HTTPS: 8 de 8. Las fichas relacionan cada resultado con su funcionalidad y evidencia exacta. La ejecución frontend inicial tuvo una advertencia, sin casos fallidos; se conserva frontend-inicial.txt y su JSON. La última ejecución ya no contiene esa advertencia de React.

En exploración productiva, COD-08 falló por recorte de filtros a 320 px. Tras la corrección se repitió como COD-08-R y aprobó. Tanto la captura fallida como la aprobada se conservaron. Los avisos NO_COLOR/FORCE_COLOR pertenecen al runner, no son fallos funcionales de CampusTrade.

## Entornos y límites

Windows, Node 24.12.0, PostgreSQL 17 local y Chromium con escritorio/Pixel 7 emulado. Las pruebas crean esquemas aislados y rechazan PostgreSQL remoto. No se enviaron correos reales ni se verificaron estudiantes artificialmente. La producción usa el servicio Render Free existente; las lecturas públicas no crean cuentas, publicaciones o transacciones.
