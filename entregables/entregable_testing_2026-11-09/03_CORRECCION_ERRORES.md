# 3 Corrección de errores detectados

Se documentan dos defectos históricos del issue #2 y dos incidencias nuevas de esta revisión, issues #3 y #4. Las resoluciones se relacionan con comentarios reales, commits y regresiones. La revisión de arquitectura #1 se registra en el apartado 4, no se presenta como un bug nuevo.

El archivo Formulario_Correccion_Errores.pdf es interactivo y permite que la persona encargada anote responsable, fecha, causa, solución, commit, prueba, resultado y comentario. Sus campos vacíos están destinados a registros futuros y no cuentan como pruebas ejecutadas.

## COR-01 Oferta de intercambio retirada

Issue: [#2](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2). Severidad: Alta histórica. Estado: CORREGIDA Y REVALIDADA.

Reproducción: Retirar la publicación ofrecida y consultar la solicitud.

Causa comprobada: El retiro solo relacionaba listing_id.

Solución: Cancelar solicitudes pendientes por listing_id y offered_listing_id dentro de la transacción.

Commit: [6b0d297](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6b0d297). Regresión: API-OPERATIONS-06.

Comentario de resolución resumido: El retiro cancela las solicitudes relacionadas y conserva el historial.

Autor registrado en GitHub: mora8292. Fecha: 30-10-2026 10:52:05 UTC-06. [Comentario original](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2#issuecomment-6528334000). En #3 y #4 el texto fue elaborado por Codex y publicado con la cuenta Git autorizada; no se atribuye a una sesión humana de usabilidad.

Evidencia: evidencias/api.xml.

## COR-02 Fecha civil de renta

Issue: [#2](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2). Severidad: Media histórica. Estado: CORREGIDA Y REVALIDADA.

Reproducción: Solicitar renta y consultar rentalStart.

Causa comprobada: El tipo DATE se convertía a un instante JavaScript con zona.

Solución: Proyectar las fechas como YYYY-MM-DD mediante to_char.

Commit: [6b0d297](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6b0d297). Regresión: API-OPERATIONS-04.

Comentario de resolución resumido: Las fechas de renta se devuelven como fechas civiles independientes del huso horario.

Autor registrado en GitHub: mora8292. Fecha: 30-10-2026 10:52:05 UTC-06. [Comentario original](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2#issuecomment-6528334000). En #3 y #4 el texto fue elaborado por Codex y publicado con la cuenta Git autorizada; no se atribuye a una sesión humana de usabilidad.

Evidencia: evidencias/api.xml.

## COR-03 Advertencia React de la imagen

Issue: [#3](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/3). Severidad: Baja. Estado: CORREGIDA Y REVALIDADA.

Reproducción: Ejecutar frontend y renderizar HomeHero.

Causa comprobada: La versión instalada de React advierte sobre fetchPriority.

Solución: Usar el atributo HTML fetchpriority en minúsculas conservando high.

Commit: [4f1927c](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/4f1927c). Regresión: 47 casos frontend y compilación.

Comentario de resolución resumido: La revalidación pasa sin la advertencia de atributo desconocido.

Autor registrado en GitHub: mora8292. Fecha: 09-11-2026 19:21:16 UTC-06. [Comentario original](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/3#issuecomment-6756155231). En #3 y #4 el texto fue elaborado por Codex y publicado con la cuenta Git autorizada; no se atribuye a una sesión humana de usabilidad.

Evidencia: evidencias/frontend-inicial.txt y frontend.txt.

## COR-04 Recorte de filtros a 320 px

Issue: [#4](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/4). Severidad: Media. Estado: CORREGIDA Y REVALIDADA.

Reproducción: Abrir Explorar y Filtros con viewport 320 por 760.

Causa comprobada: Ancho intrínseco de selectores dentro de dos columnas; dos controles alcanzaban x=340.

Solución: Permitir contraer selectores y utilizar una columna hasta 400 px.

Commit: [664f416](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/664f416). Regresión: E2E-DESKTOP-06, E2E-MOBILE-06 y COD-08-R.

Comentario de resolución resumido: Los controles permanecen dentro del panel y del viewport; cambiar y limpiar criterios también funciona.

Autor registrado en GitHub: mora8292. Fecha: 09-11-2026 19:28:21 UTC-06. [Comentario original](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/4#issuecomment-6756265762). En #3 y #4 el texto fue elaborado por Codex y publicado con la cuenta Git autorizada; no se atribuye a una sesión humana de usabilidad.

Evidencia: evidencias/COD-08.jpg, COD-08-R.jpg y navegador.json.
