# Plan de trabajo actualizado

Fecha de actualización: 29 de octubre de 2026. Versión de trabajo: 0.2.0.

La responsabilidad técnica corresponde a ISC. El equipo debe asignar a una persona real y acordar fechas para las tareas pendientes; no se atribuyen revisiones a integrantes que no las hayan realizado.

| ID    | Función o actividad                               | Estado       | Evidencia o criterio pendiente                                       |
| ----- | ------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| BL-01 | Ejecutar instalar y compilar desde la raíz        | Implementado | Workspace npm, lockfile único y compilación Vite                     |
| BL-02 | Catálogo búsqueda y filtros combinados            | Implementado | `domain/catalog.js`, pruebas de dominio e interfaz                   |
| BL-03 | Publicar y editar con validaciones                | Implementado | `ListingForm.jsx`, repositorio y pruebas de regresión                |
| BL-04 | Guardar publicaciones y favoritos tras recargar   | Implementado | Repositorio persistente y recorridos E2E                             |
| BL-05 | Adjuntar imagen local                             | Implementado | `listingImage.js`, validación de MIME tamaño y firma                 |
| BL-06 | Administrar disponibilidad propia                 | Implementado | Disponible reservado finalizado; prueba de estado terminal           |
| BL-07 | Guardar y consultar mensajes locales              | Implementado | Conversaciones separadas persistencia y prueba E2E                   |
| BL-08 | Editar perfil y exportar datos                    | Implementado | Perfil editable exportación JSON y propagación a publicaciones       |
| BL-09 | Registrar reportes locales                        | Implementado | Validación duplicados y consulta en el perfil                        |
| BL-10 | Accesibilidad y adaptación móvil                  | Implementado | Modales con foco Escape y pruebas en dos tamaños                     |
| BL-11 | Registrar bugs y revisiones                       | Preparado    | Plantillas de GitHub; requiere issues y revisiones reales            |
| BL-12 | Integración continua                              | Preparado    | Workflow de pruebas; pendiente ejecutar en GitHub tras subir cambios |
| BL-13 | Publicación de la alfa                            | Preparado    | Workflow manual Pages; pendiente activar y ejecutar despliegue       |
| BL-14 | Release etiquetada y evidencia publicada          | Pendiente    | Crear release del commit revisado y capturar URL publicada           |
| BL-15 | Cuentas y verificación institucional              | Pendiente    | Backend con autenticación y comprobación institucional               |
| BL-16 | Persistencia compartida y mensajes entre usuarios | Pendiente    | API base de datos y autorización de servidor                         |
| BL-17 | Moderación y calificaciones                       | Pendiente    | Roles operaciones persistentes y revisión real de reportes           |

## Orden de cierre de esta entrega

1. Revisar los cambios y ejecutar los comandos de validación de `PRUEBAS.md`.
2. Asignar responsables individuales y fechas del curso al plan.
3. Registrar las incidencias reales de `INCIDENCIAS.md` en GitHub y enlazar sus pruebas.
4. Subir los cambios en una rama y abrir un PR; otro integrante registra su revisión.
5. Añadir comentarios de solución y cerrar únicamente los issues resueltos.
6. Ejecutar el despliegue manual, verificar su URL y crear la release del commit aprobado.
7. Adjuntar capturas del repositorio compartido, revisión y aplicación publicada.
