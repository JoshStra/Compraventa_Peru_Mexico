# 8 Evidencia de interacción y comentarios de Codex

Por solicitud del responsable, Codex actuó como evaluador técnico y redactó sus propios comentarios mientras operaba el sistema público. Participantes humanos: cero. La sesión fue anónima y no realizó escrituras productivas; las cuentas campus.test utilizadas por E2E pertenecen al entorno local aislado.

Se registraron ocho tareas, nueve eventos por la revalidación de COD-08. Cada evento contiene autor, fecha/hora, módulo, acción, esperado, obtenido, estado, comentario y capturas. Los siete primeros eventos y el fallo inicial corresponden a 4f1927c; COD-08-R corresponde a la corrección publicada 664f416. La lista de errores de consola observados al terminar quedó vacía. Esto no sustituye una sesión de usabilidad con estudiantes reales.

## COD-01 Portada y rediseño

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:24:23 UTC-06. Estado: APROBADA.

Acción: Abrir la URL pública y revisar titular, imagen y acciones.

Esperado: Imagen cargada y acciones Explorar/Publicar visibles.

Obtenido: Portada visible; imagen 1200 px; fetchpriority=high.

Comentario propio de Codex: El nuevo fondo blanco y los dos botones permiten distinguir la acción principal. La fotografía es editorial y no implica inventario disponible.

Evidencia: evidencias/COD-01.txt, evidencias/COD-01.jpg. Código observado: 4f1927c.

## COD-02 Catálogo

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:24:30 UTC-06. Estado: APROBADA.

Acción: Pulsar Explorar artículos en la portada.

Esperado: Abrir el catálogo con búsqueda, filtros y estado sin resultados.

Obtenido: Se abrió Explora el catálogo con 0 resultados y la acción Limpiar búsqueda y filtros.

Comentario propio de Codex: La transición desde la portada funciona y el estado vacío propone cómo continuar. El catálogo productivo está vacío, por lo que aquí no se evalúan coincidencias con inventario.

Evidencia: evidencias/COD-02.txt, evidencias/COD-02.jpg. Código observado: 4f1927c.

## COD-03 Búsqueda y filtros

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:24:46 UTC-06. Estado: APROBADA.

Acción: Introducir material-revision-codex, categoría Libros, modalidad Renta y precios 100 a 300; limpiar búsqueda y filtros.

Esperado: Los controles aceptan valores y regresan a sus valores iniciales al limpiar.

Obtenido: La búsqueda y precios quedaron vacíos; categoría y modalidad volvieron a Todas las opciones.

Comentario propio de Codex: Los filtros se restablecen de forma coherente. Esta comprobación valida controles y estado vacío; la exactitud de coincidencias se acredita con fixtures en las pruebas API/E2E.

Evidencia: evidencias/COD-03.txt, evidencias/COD-03.jpg, evidencias/COD-03-antes.txt. Código observado: 4f1927c.

## COD-04 Acceso institucional

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:24:51 UTC-06. Estado: APROBADA.

Acción: Abrir Iniciar sesión desde el catálogo.

Esperado: Formulario con etiquetas visibles y dominio itesa.edu.mx.

Obtenido: El diálogo muestra Correo institucional, Contraseña y Dominio autorizado: itesa.edu.mx.

Comentario propio de Codex: El dominio autorizado está explicado antes de ingresar datos. El envío real de verificación continúa pendiente de proveedor y esta prueba no lo acredita.

Evidencia: evidencias/COD-04.txt, evidencias/COD-04.jpg. Código observado: 4f1927c.

## COD-05 Accesibilidad de formularios

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:24:58 UTC-06. Estado: APROBADA.

Acción: Pulsar Escape con el foco en Correo institucional.

Esperado: Cerrar el diálogo y devolver el foco a Iniciar sesión.

Obtenido: El diálogo desapareció y el foco volvió al botón Iniciar sesión.

Comentario propio de Codex: El retorno del foco permite continuar con teclado sin perder la ubicación. Es una comprobación puntual, no una auditoría completa de accesibilidad.

Evidencia: evidencias/COD-05.txt, evidencias/COD-05.jpg. Código observado: 4f1927c.

## COD-06 Permisos y publicación

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:25:06 UTC-06. Estado: APROBADA.

Acción: Pulsar Publicar en el catálogo sin iniciar sesión.

Esperado: Solicitar autenticación sin abrir el editor ni crear un artículo.

Obtenido: Se abrió Inicia sesión; no se abrió el editor y no se envió ninguna publicación.

Comentario propio de Codex: La nueva apariencia mantiene el requisito de autenticación antes de publicar. El permiso del servidor también se prueba en API-LISTINGS-01.

Evidencia: evidencias/COD-06.txt, evidencias/COD-06.jpg. Código observado: 4f1927c.

## COD-07 Diseño adaptable de portada

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:25:15 UTC-06. Estado: APROBADA.

Acción: Revisar la portada pública con viewport 390 por 844.

Esperado: Contenido dentro del ancho y acciones legibles en móvil.

Obtenido: Ancho del documento 375 px frente a viewport 390 px; botones de 46/46 px de alto.

Comentario propio de Codex: El titular se reparte en varias líneas y las dos acciones permanecen legibles. La fotografía queda debajo del texto, sin desbordamiento horizontal.

Evidencia: evidencias/COD-07.txt, evidencias/COD-07.jpg. Código observado: 4f1927c.

## COD-08 Filtros en móvil estrecho

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:25:37 UTC-06. Estado: FALLIDA.

Acción: Abrir el catálogo con filtros desplegados a 320 por 760.

Esperado: Todos los controles de filtros caben dentro del ancho visible.

Obtenido: Se observaron controles que rebasan el borde derecho: [{"label":"Categoría","right":340,"width":171},{"label":"Condición","right":340,"width":171}].

Comentario propio de Codex: La composición general cabe, pero las columnas de filtros necesitan permitir que los selectores se contraigan. Registraré el defecto y repetiré esta comprobación después de corregirlo.

Evidencia: evidencias/COD-08.txt, evidencias/COD-08.jpg. Código observado: 4f1927c.

## COD-08-R Filtros en móvil estrecho

Autor: Codex, evaluador técnico automatizado. Fecha: 09-11-2026 19:31:02 UTC-06. Estado: APROBADA.

Acción: Repetir COD-08 después de publicar la corrección 664f416, a 320 por 760.

Esperado: Todos los controles dentro del ancho visible y del panel.

Obtenido: Controles fuera del viewport: 0; documento 320 px.

Comentario propio de Codex: La distribución en una columna y el ancho de los selectores corrigen el recorte. La captura previa y la revalidación permiten comprobar la mejora.

Evidencia: evidencias/COD-08-R.txt, evidencias/COD-08-R.jpg. Código observado: 664f416.

La captura COD-08 conserva el fallo inicial y COD-08-R conserva el resultado corregido. Se mantiene también sesion_codex_inicial.json, además del registro completo sesion_codex.json.
