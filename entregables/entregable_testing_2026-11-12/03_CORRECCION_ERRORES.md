# 3 Corrección de errores detectados

## Cambio del requisito de confirmación

Issue #6, registrado retrospectivamente como cambio solicitado por el responsable. La versión anterior bloqueaba publicar, subir imágenes, enviar mensajes y operar para cuentas sin confirmar. No se presenta como un fallo descubierto en la ejecución actual: se retiró ese requisito por decisión del responsable.

Comentario de resolución de Codex: retiré requireVerified de las rutas y lo sustituí por requireUser, conservando CSRF, propiedad y participación. Eliminé el bloqueo de la interfaz, las insignias y los endpoints de confirmación y reenvío. El registro ya no genera mensajes ni tokens. verified_at conserva su valor histórico y deja de controlar permisos. La recuperación conserva tokens de caducidad y uso único, y los tokens antiguos de verificación no sirven para cambiar contraseñas.

Commit publicado: [0274f2b](https://github.com/JoshStra/Compraventa_Peru_Mexico/commit/0274f2b98a376ee67116fd5898ea1c9d14d63092). Regresión: API-AUTH-00/03, API-LISTINGS-01/05, API-SEC-13, E2E-*-06/08/12 y comprobaciones Docker/SMTP. Estado: APROBADO.

Comentario publicado: [resolución del issue 6](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/6#issuecomment-6844408265). El issue está cerrado con comentario, commit y evidencia.

## Errores anteriores revalidados

Los issues #2 a #5 conservan correcciones de operaciones, atributo de React, recorte de filtros y disposición/foco móvil. Las regresiones API y E2E actuales siguen aprobadas. Los comentarios originales mantienen su fecha y alcance; el código que antes estaba solo local ya forma parte de la rama publicada. No se reabrieron incidencias para aparentar actividad.

## Formulario de resolución

Formulario_Correccion_Errores.docx contiene ocho campos nativos editables de Word: incidencia e issue; responsable y fecha; módulo y pasos; causa; comentario de solución; commit; regresión y estado; evidencia y comentario publicado. La persona encargada debe completarlos al resolver una nueva incidencia. El formulario vacío no equivale a una prueba ni a un issue completado.

En el informe unificado del 13 de noviembre de 2026, este formulario está integrado dentro del apartado 3, con sus ocho campos editables. La versión independiente se conserva como archivo complementario; no es necesaria para completar el formulario del informe único.
