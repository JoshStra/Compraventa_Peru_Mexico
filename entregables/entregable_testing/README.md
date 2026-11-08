# CampusTrade entregable de testing

Corte 7 de noviembre de 2026. Código probado `420a9bb89c91164cebc21e9e4a4a5a5173f81ff8`; origin/main conservado. **97 casos aprobados**: 47 frontend, 34 API/config, diez E2E y seis sondas públicas de lectura. API/E2E repetidos en [CI intento 2](https://github.com/JoshStra/Compraventa_Peru_Mexico/actions/runs/41135024269/job/128585456662); fecha local 7 de noviembre, 19:07:59 a 19:09:12 UTC-06. El catálogo JSON/CSV conserva tiempos individuales y fuentes.

## Documentos para la entrega

1. [Casos identificables y ejecutados](01_CASOS_PRUEBA.md)
2. [Reporte de ejecución](02_REPORTE_EJECUCION.md)
3. [Corrección de errores y formulario](03_CORRECCION_ERRORES.md)
4. [Incidencias e issues con comentarios](04_REGISTRO_INCIDENCIAS.md)
5. [Resultados de testing](05_RESULTADOS_TESTING.md)
6. [Evaluación funcional](06_EVALUACION_FUNCIONAL.md)
7. [Cambios posteriores al feedback técnico](07_CAMBIOS_FEEDBACK.md)
8. [Interacciones y pendiente de usuarios humanos](08_INTERACCION_USUARIOS.md)

[PDF consolidado con formularios editables](CampusTrade_Entregable_Testing.pdf) · [Catálogo CSV](casos_ejecutados.csv) · [Catálogo JSON](casos_ejecutados.json) · [Resumen verificable](resumen_testing.json).

## Matriz de la rúbrica

| Apartado | Estado de la evidencia | Soporte |
|---|---|---|
| 1 | CUMPLIDO | Casos con procedimiento, esperado, obtenido, fecha y estado. |
| 2 | CUMPLIDO | Ejecución y resultados vinculados a módulos. |
| 3 | CUMPLIDO | Resolución real en issue #2 y formulario editable. |
| 4 | CUMPLIDO | Issues #1/#2 cerrados con comentarios consultados. |
| 5 | CUMPLIDO | Totales y conclusiones sin duplicar ejecuciones. |
| 6 | CUMPLIDO | Reporte RF-01 a RF-14 con límites de aceptación. |
| 7 | CUMPLIDO | Cronología verificable de feedback técnico y commits. |
| 8 | PENDIENTE | Sin comentarios de personas; formato preparado y logs automatizados diferenciados. |

La matriz evalúa la documentación entregada. No implica aceptación productiva completa. Correo real, sesiones de usabilidad, donación E2E dedicada y restauración siguen pendientes. No se crearon cuentas institucionales ni se alteró su verificación. Las capturas históricas siguen identificadas como del 30 de octubre.

Para repetir: preparar PostgreSQL local y configuración privada; npm test, npm run test:api, npm run build y npm run test:e2e. Para los casos productivos ejecutar únicamente GET sobre los endpoints descritos en produccion-lectura.json. El workflow .github/workflows/ci.yml documenta la configuración exacta de CI. Los cambios documentales posteriores no modifican el SHA que fue probado o desplegado.
