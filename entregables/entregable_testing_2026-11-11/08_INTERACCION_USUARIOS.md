# 8. Evidencia de interacción y comentarios de Codex



Ocho registros de interacción ejecutada por Codex mediante Chrome automatizado, con cuentas de prueba. Participantes humanos: 0. Cada registro relaciona fecha y hora, módulo, acción, resultado y comentario propio con el recorrido y su evidencia. Los comentarios fueron elaborados después de revisar el resultado del runner y las capturas; no son testimonios de alumnos.



## COD-20261111-01. Navegación y rol

Fecha de interacción: 2026-11-11T10:06:16-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-04. Estado: APROBADA.

Acción: Con administrador sintético, abrir a 320 px y recorrer Perfil, Favoritos, Operaciones y Gestión.

Resultado: Se comprobó: Cinco acciones de al menos 44 px, sin desbordamiento; panel administrativo alcanzable desde Perfil. Runner aprobado; duración 1101 ms.

Comentario de Codex: El acceso a Favoritos, Operaciones y Gestión se conserva desde Perfil con cinco acciones inferiores. Los botones cumplieron el tamaño mínimo comprobado.

Evidencia: evidencias/navegador.json y evidencias/mobile-administracion-320.png



## COD-20261111-02. Búsqueda, fichas y detalle

Fecha de interacción: 2026-11-11T10:06:18-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-05. Estado: APROBADA.

Acción: Crear cuatro modalidades; buscar, filtrar categorías y renta; quitar chips; abrir detalle y recorrerlo con Tab/Shift+Tab.

Resultado: Se comprobó: Resultados y consulta conservados, dos columnas, precio $280 y foco visible; detalle a pantalla completa con foto de 300 px. Runner aprobado; duración 1059 ms.

Comentario de Codex: La búsqueda global devolvió las cuatro modalidades y quitar un chip conservó la consulta. La cuadrícula pasó a dos columnas en móvil.

Evidencia: evidencias/navegador.json y evidencias/mobile-minimal-catalogo.png



## COD-20261111-03. Registro y foco

Fecha de interacción: 2026-11-11T10:06:16-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-03. Estado: APROBADA.

Acción: Abrir registro; comprobar ayudas; mostrar y ocultar contraseña; cambiar a acceso y recuperación; cerrar con Escape.

Resultado: Se comprobó: Ayudas asociadas, valor conservado, estado del control correcto y foco dentro del formulario y de vuelta al origen. Runner aprobado; duración 879 ms.

Comentario de Codex: Las ayudas del registro son legibles y están asociadas a los campos. Mostrar y ocultar la contraseña conservó el valor; Escape devolvió el foco.

Evidencia: evidencias/navegador.json y evidencias/mobile-registro-con-ayudas.png



## COD-20261111-04. URL e historial

Fecha de interacción: 2026-11-11T10:06:15-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-02. Estado: APROBADA.

Acción: Abrir consulta con renta, precio y página 2; recargar, ir a Inicio, volver con Atrás y cambiar condición.

Resultado: Se comprobó: Consulta, filtros, página y hash se restauran; cambiar un filtro reinicia la página. Runner aprobado; duración 655 ms.

Comentario de Codex: La recarga y Atrás conservaron consulta, renta, precio y página. Cambiar la condición reinició la paginación.

Evidencia: evidencias/navegador.json



## COD-20261111-05. Publicación con imagen

Fecha de interacción: 2026-11-11T10:06:19-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-06. Estado: APROBADA.

Acción: Registrar y verificar mediante correo aislado; publicar con PNG, recargar, abrir Perfil y editar título.

Resultado: Se comprobó: La imagen y publicación persisten, la edición se refleja y no se producen errores de página. Runner aprobado; duración 1482 ms.

Comentario de Codex: La publicación con PNG siguió visible al recargar y la edición del título se reflejó en Perfil. El correo usado fue el transporte de pruebas.

Evidencia: evidencias/navegador.json y evidencias/mobile-perfil-postgresql.png



## COD-20261111-06. Mensajes y venta

Fecha de interacción: 2026-11-11T10:06:25-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-12. Estado: APROBADA.

Acción: Enviar y responder entre dos sesiones; solicitar, aceptar, finalizar la venta y calificar.

Resultado: Se comprobó: Mensajes entregados, estado Finalizada y calificación 5; chat al pie del móvil, sin solapamiento ni navegación inferior. Runner aprobado; duración 12659 ms.

Comentario de Codex: Dos sesiones intercambiaron mensajes y finalizaron una venta con calificación. El campo de envío quedó al pie del móvil y la cabecera no se encimó.

Evidencia: evidencias/navegador.json y evidencias/mobile-mensajes.png



## COD-20261111-07. Reporte y moderación

Fecha de interacción: 2026-11-11T10:06:26-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-13. Estado: APROBADA.

Acción: Reportar una publicación, entrar como administrador y registrar la resolución.

Resultado: Se comprobó: El reporte y comentario persisten y la administración muestra la decisión registrada. Runner aprobado; duración 7112 ms.

Comentario de Codex: El administrador pudo resolver el reporte y dejar la decisión registrada. El acceso administrativo se evaluó con una cuenta de prueba.

Evidencia: evidencias/navegador.json y evidencias/mobile-administracion.png



## COD-20261111-08. Devolución vigente

Fecha de interacción: 2026-11-11T10:06:23-06:00 (inicio del recorrido). Actor: Codex (agente técnico). Caso: E2E-MOBILE-11. Estado: APROBADA.

Acción: Crear dos rentas sucesivas y devolver la anterior; revisar las dos operaciones.

Resultado: Se comprobó: Solo la renta vigente permite Registrar devolución. Runner aprobado; duración 1452 ms.

Comentario de Codex: El historial distinguió la renta anterior de la vigente y solo ofreció devolución para la operación actual.

Evidencia: evidencias/navegador.json y evidencias/mobile-security-rental-history.png
