# Registro de incidencias y soluciones

Las siguientes incidencias se observaron en el código previo y se corrigieron en la versión de trabajo 0.2.0. El estado local de una corrección no equivale a cerrar un issue en GitHub.

| ID     | Incidencia y reproducción                                                                     | Solución implementada                                                                   | Validación                                                |
| ------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| INC-01 | README e iniciador ejecutaban npm desde una raíz sin package.json                             | Workspace raíz y comandos unificados con un solo lockfile                               | Instalación compilación y pruebas desde la raíz           |
| INC-02 | Publicar usaba event.currentTarget después de await; el formulario podía perder su referencia | Se captura FormData durante submit y el repositorio realiza el guardado antes de cerrar | Prueba de interfaz publica y vuelve a abrir el estado     |
| INC-03 | Publicaciones y favoritos desaparecían al recargar                                            | Estado versionado en localStorage con tratamiento de errores                            | Pruebas del repositorio y E2E con recarga                 |
| INC-04 | El botón enviar solo mostraba una notificación y descartaba el mensaje                        | Mensajes por conversación con texto fecha e identificador persistentes                  | Prueba de aislamiento entre conversaciones y recarga      |
| INC-05 | Títulos y descripciones con espacios y precios inválidos se aceptaban                         | Validación de dominio compartida antes de cualquier escritura                           | Casos de espacios límites importes y catálogos no válidos |
| INC-06 | Herramientas buscaba una palabra fija en vez de filtrar toda la categoría                     | Filtro exacto de categoría acumulable con los demás criterios                           | Pruebas de categoría y tarifa de renta                    |
| INC-07 | Una búsqueda sin resultados mostraba el mensaje de favoritos vacíos                           | Estados vacíos específicos con acción para limpiar filtros                              | Prueba de interfaz y E2E                                  |
| INC-08 | Perfil y botones mostraban estadísticas inventadas y acciones sin efecto                      | Perfil editable estadísticas calculadas edición de artículos y estados                  | E2E con edición de perfil publicación y disponibilidad    |
| INC-09 | Solo existía compilación esbuild indirecta y preview no correspondía a su salida              | Compilación y preview de Vite sobre frontend/dist                                       | Pruebas E2E sirven el compilado                           |
| INC-10 | Modales sin control de foco ni cierre con Escape                                              | Modal compartido con foco contenido restauración y Escape                               | Regresión de interfaz y teclado en navegador              |

## Comentario de solución para cada issue real

También se corrigió una incidencia detectada durante estas pruebas: algunas descargas de la copia JSON quedaban pendientes. El enlace ahora se agrega al documento y el URL del Blob se conserva durante 60 segundos. La descarga y el contenido exportado se comprobaron en Chromium y después en Edge; el log de ese recorrido está en `entregables/evidencias/pruebas-edge-exportacion.txt`.

Completar y publicar con los datos del cambio correspondiente:

```text
Causa: [condición concreta que producía el fallo]
Solución: [archivos y cambio aplicado]
Validación: [comando caso ejecutado y resultado]
Evidencia: [captura o log real]
PR o commit: [enlace real]
```

El issue #1 existente describe la separación de archivos. La estructura actual mantiene la aplicación en frontend. Antes de cerrarlo se debe revisar el cambio en GitHub y añadir un comentario con evidencia real. Los casos anteriores no se publicaron ni cerraron automáticamente.
