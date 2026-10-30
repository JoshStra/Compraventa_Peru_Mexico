# Colaboración y evidencias de entrega

## Issues y revisión de cambios

1. Crear un issue por incidencia reproducible usando el formulario de bugs. Vincular el caso correspondiente de `INCIDENCIAS.md`.
2. Trabajar en una rama y abrir un PR que describa el problema, el comportamiento resultante y las pruebas.
3. Solicitar la revisión a otro integrante del equipo. El autor no registra una aprobación en nombre del revisor.
4. Corregir las observaciones y esperar el resultado real de las pruebas en GitHub Actions.
5. Publicar en el issue un comentario con causa, solución, validación y enlace al PR. Cerrar el issue cuando la solución esté integrada.

## Publicación de la alfa

1. Un administrador activa Settings → Pages → Source → GitHub Actions.
2. Desde main, ejecutar el workflow **Publicar alfa en GitHub Pages** en Actions.
3. Esperar la finalización de pruebas y despliegue. Abrir la URL devuelta por el entorno github-pages y verificar el catálogo y el formulario.
4. Crear una release, por ejemplo `v0.2.0`, sobre el commit revisado. Incluir el alcance local de la alfa y las notas del changelog.

El workflow configura la ruta base del nombre del repositorio. Para publicar en otro hosting, `npm run build` genera rutas relativas por defecto y el directorio a servir es `frontend/dist/`.

La guía de publicación sigue la [documentación oficial de Vite para GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).

## Evidencia por criterio

| Criterio                   | Archivo o captura que se entrega                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| Avance del backlog         | `docs/BACKLOG.md` con responsables individuales y fechas acordadas por el equipo               |
| Bugs cerrados              | Formulario del issue y captura del cierre con comentario de solución                           |
| Incidencias y validaciones | `docs/INCIDENCIAS.md`, ejecución de pruebas y capturas reales de `entregables/evidencias/`     |
| Estructura funcional       | `docs/ARQUITECTURA.md` con diagrama y árbol de componentes                                     |
| Repositorio colaborativo   | Captura de GitHub que muestre el repositorio y contribuciones o interacción de los integrantes |
| PR revisados               | Captura o enlace del PR con la revisión real de otro integrante                                |
| Releases y despliegue      | Release del commit aprobado y captura de la aplicación con su URL publicada visible            |

Las capturas de Playwright muestran el sistema local. La evidencia de colaboración y la captura de despliegue deben obtenerse después de realizar esas acciones en GitHub.
