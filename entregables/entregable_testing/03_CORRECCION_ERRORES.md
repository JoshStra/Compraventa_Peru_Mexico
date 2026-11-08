# Corrección de errores detectados

Los comentarios de resolución existentes fueron consultados el 7 de noviembre de 2026; autor, fecha, issue y commit se conservan en los JSON de evidencias. No se atribuyen comentarios a un revisor que no haya participado.

## Registro COR 01 Oferta retirada

Issue: [#2](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2). Módulo: publicaciones e intercambio. Severidad histórica: alta. Antes, retirar un artículo ofrecido dejaba la solicitud en pending. Causa: el UPDATE solo consideraba listing_id. Solución: cancelar solicitudes pendientes vinculadas tanto por listing_id como por offered_listing_id dentro de la transacción. Commit: [6b0d297](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/6b0d2979dddd3b44759d2bad1bb727864987b815), 30-10-2026 10:51:45 UTC-06.

Comentario del encargado: mora8292, 30-10-2026 16:52:05Z. Síntesis: el retiro cancela solicitudes donde la publicación es principal u ofrecida, dentro de una transacción; se agregaron regresiones. [Comentario original](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/2#issuecomment-6528334000). Es una síntesis, no una declaración nueva del autor.

Resultado actual: API-OPERATIONS-06 aprobada en CI del 7 de noviembre; creación 201, retiro 200 y operación cancelled. Estado: CORREGIDA Y REVALIDADA. No se requirió otro cambio de aplicación.

## Registro COR 02 Fechas civiles de renta

Issue: el mismo #2. Severidad histórica: media. Antes, rentalStart salía como un instante con zona, en lugar de YYYY-MM-DD. Causa: conversión automática de DATE por pg. Solución: proyección to_char en consultas de operaciones, en el mismo commit 6b0d297.

Comentario del encargado: el mismo comentario verificable de mora8292 explica la serialización YYYY-MM-DD independiente del huso. Resultado actual: API-OPERATIONS-04 aprobada; fechas exactas, tres días a 35 producen 105 y devolución libera el artículo. Estado: CORREGIDA Y REVALIDADA.

## Registro COR 03 Organización del repositorio

Issue: [#1](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/1), abierto por JoshStra el 16-10-2026 a las 22:20:27Z. Comentario de mora8292 del 30-10-2026 a las 16:49:30Z confirma frontend/src, backend/src y workspaces. [Resolución](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/1#issuecomment-6528281194). Estado leído: closed. La reorganización 0f91601 antecede al issue; los incrementos full stack posteriores se distinguen en el apartado 7.

## Formulario para nuevas correcciones

ID de incidencia e issue: ____________________
Responsable y fecha/hora: ____________________
Módulo y reproducción: ____________________
Causa comprobada: ____________________
Comentario de cómo se resolvió: ____________________
Commit y archivos: ____________________
Caso de regresión y resultado: ____________________
Estado y enlace al comentario: ____________________

El PDF incluye campos editables para registrar una corrección futura. Un formulario vacío no acredita ejecución ni resolución.
