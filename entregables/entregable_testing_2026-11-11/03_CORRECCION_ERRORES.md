# 3. Corrección de errores detectados

## COR-20261111-01. Cabecera de mensajes

Incidencia #5. La altura fija heredada podía encimar el nombre largo y el enlace del artículo. Se cambió a altura automática con mínimo y se permitió ajustar el contenido. Resultado: E2E-DESKTOP-12 y E2E-MOBILE-12 comprueban que el artículo comienza después de la cabecera. APROBADA.

## COR-20261111-02. Campo de mensaje al pie

Incidencia #5. El historial conservaba un máximo de 440 px y dejaba espacio bajo el campo de envío móvil. Se quitó ese máximo y se mantuvo el historial desplazable dentro del contenedor flex. E2E-MOBILE-12 comprueba el campo de al menos 84 px y su borde inferior igual al viewport. APROBADA.

## COR-20261111-03. Ancho a 320 px

Incidencia #5. El ancho mínimo del cuerpo rebasaba el espacio útil con barras clásicas. Se retiró el mínimo. La medición real registra viewport 320, clientWidth 305 y scrollWidth 305; E2E-*-04 comprueba los límites y los cinco controles. APROBADA.

## COR-20261111-04. Foco del detalle

Incidencia #5. El recorrido de Tab incluía controles ocultos por la adaptación móvil. Se filtraron controles ocultos y contenedores no visibles antes de calcular los extremos del recorrido. E2E-*-05 comprueba Tab/Shift+Tab entre el cierre visible y Reportar publicación. APROBADA.

Las cuatro correcciones forman parte del incremento funcional 2075900. Se detectaron durante la revisión del diseño y se revalidaron; no se presentan como fallos de la nueva ejecución, que finalizó sin fallos.

Comentario de resolución: [issue #5](https://github.com/JoshStra/Compraventa_Peru_Mexico/issues/5#issuecomment-6800883528). El cierre acredita corrección y validación local; el código sigue pendiente de push. El formulario Word complementario permite registrar responsable, fecha, reproducción, causa, comentario de solución, commit, regresión y evidencia en campos editables.

Los issues históricos #2, #3 y #4 conservan sus comentarios y fechas originales. Las correcciones del diseño nuevo no modifican retrospectivamente esas evidencias.
