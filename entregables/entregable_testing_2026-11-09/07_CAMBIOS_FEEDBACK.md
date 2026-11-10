# 7 Cambios posteriores al feedback

Se distinguen la referencia visual solicitada por el responsable, los hallazgos técnicos de Codex y los comentarios históricos de GitHub. No se inventa feedback humano de usabilidad. Las fechas de esta relación provienen de Git y GitHub y se conservaron sin modificaciones.

| Commit | Fecha de commit México | Cambio y relación |
| --- | --- | --- |
| [6b0d297](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6b0d2979dddd3b44759d2bad1bb727864987b815) | 30-10-2026 10:51:45 UTC-06 | fix(operations): cancelar ofertas retiradas y conservar fechas civiles |
| [f5130c1](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/f5130c1f6dc30961969a9b42f3765dfae96060b4) | 30-10-2026 11:41:39 UTC-06 | fix(deploy): detectar el origen HTTPS asignado por Render |
| [3a55ee7](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/3a55ee7c29827902712812b09c9f1fcc76728d68) | 09-11-2026 14:03:54 UTC-06 | feat: aplica galería blanca a CampusTrade y valida 91 regresiones |
| [4a98809](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/4a98809593a61a6b3d47b23c8f5ba143168a4779) | 09-11-2026 14:17:46 UTC-06 | docs(deploy): verifica rediseño público y ocho comprobaciones HTTPS |
| [4f1927c](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/4f1927c9fe73e80f483961d6d204422c59fd29e0) | 09-11-2026 19:21:11 UTC-06 | fix: usa prioridad HTML compatible con React en portada |
| [664f416](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/664f416e5e84cabb7896be5055d889929045cfb3) | 09-11-2026 19:28:17 UTC-06 | fix: evita recorte de filtros en pantallas estrechas |

La referencia visual aportada por el responsable motivó 3a55ee7: galería blanca, acciones azul y neutra, tipografía amplia, tarjetas redondeadas, imagen editorial y adaptación de los paneles. El commit 4a98809 conservó la evidencia del primer despliegue de ese rediseño.

La advertencia de React detectada al preparar esta entrega originó el issue #3 y la corrección 4f1927c, probada antes del commit. La comprobación exploratoria COD-08 originó el issue #4 y 664f416, con dos regresiones E2E nuevas y revalidación productiva. Ambos commits se subieron al origin existente y se publicaron en el mismo Render Free.

Las recomendaciones de Codex del 8 de noviembre sobre errores asociados al correo y explicación de bloqueos conservan su estado pendiente; el cambio visual no se presenta como implementación automática de esas propuestas. El commit de esta nueva entrega documenta resultados después de terminar las verificaciones. Auto-deploy está apagado, por lo que ese commit documental no altera el SHA de aplicación publicado.
