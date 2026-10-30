# Issues cerrados y verificados

Comprobación del 2026-10-30, API de GitHub y vista web. No se cuentan como cerrados intentos de operación rechazados. El conector devolvió 403 al escribir; se utilizó posteriormente la autenticación Git existente, con permisos reales, y se verificó el resultado.

| Issue | Problema / causa | Solución y archivos | Commit / regresión | Cierre real UTC | Comentario |
|---|---|---|---|---|---|
| [#1 Arquitectura](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/1) | CSS y JS originales en raíz. Reorganización solicitada por JoshStra. | frontend/src y backend/src separados; workspaces. | [0f91601](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/0f91601), [82c6954](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/82c6954), [ff48d53](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/ff48d53); build, 47 pruebas frontend y 10 E2E. | 2026-10-30 16:49:31Z | [Resolución por mora8292](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/1#issuecomment-6528281194) |
| [#2 Operaciones](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2) | Retiro solo revisaba listing_id; pg serializaba DATE como instante con zona. | services/listings.js cancela por principal u oferta; services/operations.js proyecta fecha civil; pruebas de operaciones y persistencia. | [6b0d297](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6b0d297); antes 27/29, después 30/30 API. | 2026-10-30 16:52:06Z | [Resolución por mora8292](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2#issuecomment-6528334000) |

Reproducción #2: crear dos publicaciones de intercambio, solicitar una ofreciendo la otra, retirar la ofrecida y consultar operaciones. Antes: pending; después: cancelled. Renta: consultar rentalStart tras solicitar fechas; antes: 2026-10-31T06:00:00.000Z; después: 2026-10-31. Ambos casos están automatizados en backend/test/operations.test.js.

Evidencias: [issue 1 y comentario](evidencias/02-issue-1-cerrado.jpg), [issue 2 y comentario](evidencias/02-issue-2-cerrado.jpg). Los comentarios describen lo validado en su fecha; el total posterior de treinta pruebas no modifica retrospectivamente el de veintiocho citado en el cierre de arquitectura.
