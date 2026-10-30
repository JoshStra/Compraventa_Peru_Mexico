# CampusTrade

Aplicación alfa para comprar, rentar, intercambiar y donar materiales académicos. La versión 0.2.0 permite publicar y administrar artículos, guardar favoritos y conservar conversaciones y reportes en el navegador.

## Ejecutar el proyecto

Requiere Node.js 24 y npm. Ejecuta desde la raíz del repositorio:

```bash
npm ci
npm run dev
```

Para compilar y revisar la salida:

```bash
npm run build
npm run preview
```

Abre la URL que indique Vite. La compilación se genera en `frontend/dist/`; se sirve por HTTP y no se abre mediante `file://`.

En Windows puedes abrir `iniciar-dev.cmd`: instala dependencias si hacen falta y abre la aplicación en el navegador.

## Alcance de esta versión

- Búsqueda sin distinguir acentos; filtros por carrera, categoría, modalidad, condición, precio y disponibilidad.
- Publicaciones con validación de contenido, precio e imagen opcional de hasta 500 KB.
- Favoritos, publicaciones, perfil, mensajes y reportes persistentes tras recargar.
- Edición de artículos propios y estados Disponible, Reservado y Finalizado.
- Perfil editable, estadísticas calculadas y exportación de datos en JSON.
- Mensajes separados por conversación y reportes locales consultables en el perfil.
- Modales con control de foco y Escape; interfaz adaptable a móvil y escritorio.

El almacenamiento es **local a cada navegador y origen**. No existe autenticación institucional, entrega de mensajes entre personas, moderación, pagos ni base de datos compartida. Los artículos iniciales son ejemplos y los perfiles de demostración están identificados. No se deben usar datos sensibles en esta alfa.

## Pruebas

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

En Windows, para usar Edge instalado:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
```

Las pruebas E2E sirven el compilado y generan capturas de escritorio y móvil en `entregables/evidencias/`. Los detalles y límites de la validación están en [docs/PRUEBAS.md](docs/PRUEBAS.md).

## Despliegue y colaboración

La integración continua ejecuta las pruebas al recibir un PR o un push a main. El despliegue a GitHub Pages es manual: después de subir y revisar los cambios, activa **Settings → Pages → Source → GitHub Actions** y ejecuta **Publicar alfa en GitHub Pages**. El workflow comprueba el proyecto antes de publicar y devuelve la URL real en el entorno github-pages. Sigue la [guía oficial de Vite](https://vite.dev/guide/static-deploy.html#github-pages).

El flujo para issues, revisiones, releases y evidencias está en [docs/COLABORACION.md](docs/COLABORACION.md). Estos archivos preparan el proceso; no representan aprobaciones ni despliegues ya realizados.

## Preparación para la siguiente fase

Los datos iniciales viven en `frontend/src/data/mockListings.js`. `campusRepository.js` centraliza las operaciones y `domain/catalog.js` sus reglas. `listingRepository.js` conserva una fachada asíncrona para catálogo. El siguiente incremento requiere sustituir la persistencia local por una API con autenticación, autorización y base de datos.

Consulta la [arquitectura actual](docs/ARQUITECTURA.md), el [backlog actualizado](docs/BACKLOG.md), el [registro de incidencias](docs/INCIDENCIAS.md) y el [historial de cambios](CHANGELOG.md).

## Decisiones de producto

La versión prioriza búsqueda visible, categorías académicas, condición del artículo y entrega dentro del campus. Los documentos de fase 2 en `entregables/` conservan el contexto de requerimientos y encuesta; describen la fase anterior y componentes futuros.
