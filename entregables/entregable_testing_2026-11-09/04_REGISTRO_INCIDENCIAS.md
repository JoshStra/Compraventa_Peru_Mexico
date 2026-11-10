# 4 Registro de incidencias en pruebas

Los cuatro issues se consultaron de nuevo mediante GitHub y la API oficial. La instantánea github-incidencias.json conserva cuerpos, autores, fechas, estado y comentarios. Los issues #3 y #4 se abrieron antes de sus correcciones, recibieron comentario técnico después de las pruebas y se cerraron con state_reason completed.

| Issue | Incidencia | Estado | Comentarios | Cierre México |
| --- | --- | --- | --- | --- |
| [#1](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/1) | Revisión de arquitectura y separación de componentes | closed | 1 | 30-10-2026 10:49:31 UTC-06 |
| [#2](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2) | Operaciones: oferta retirada permanece pendiente y fechas de renta incluyen zona horaria | closed | 1 | 30-10-2026 10:52:06 UTC-06 |
| [#3](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/3) | Portada: advertencia React por atributo fetchPriority en desarrollo | closed | 1 | 09-11-2026 19:21:16 UTC-06 |
| [#4](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/4) | Filtros: selectores rebasan el borde visible a 320 px | closed | 1 | 09-11-2026 19:28:22 UTC-06 |

El issue #2 reúne dos defectos; no se inventaron dos issues distintos para ellos. El resultado histórico 27 de 29 y su corrección posterior a 30 de 30 corresponden al 30 de octubre; la suite actual tiene 34 casos por las cuatro comprobaciones adicionales de configuración.

La advertencia React de #3 no produjo fallos de aserciones. El recorte de #4 sí produjo una comprobación exploratoria fallida, COD-08. Tras corregirlo, los dos casos E2E nuevos y COD-08-R aprobaron. El defecto se detectó midiendo los controles, porque scrollWidth por sí solo no revelaba el recorte.

No se cerraron incidencias sin comentario ni se alteraron fechas. Los errores transitorios de permisos del conector y del script de registro fueron del entorno de entrega, no defectos de CampusTrade; la consulta final confirmó los estados y comentarios reales.
