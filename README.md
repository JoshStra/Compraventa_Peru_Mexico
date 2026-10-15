# CampusTrade

Prototipo alfa de una plataforma web para comprar, vender, rentar, intercambiar y donar materiales académicos entre estudiantes.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

Para crear la versión de producción:

```bash
npm run build
```

También puedes abrir directamente `index.html` al terminar `npm run build`. Esa es la versión compilada del prototipo y no requiere que Vite permanezca encendido.

Como alternativa en Windows, abre `iniciar-dev.cmd`. El archivo comprueba npm, instala dependencias solo si hace falta y abre automáticamente la dirección local correcta en el navegador.

## Alcance de esta versión

- Catálogo con búsqueda y filtros por carrera, modalidad y condición.
- Detalle del artículo, favoritos, perfil y mensajería simulada.
- Formulario de publicación funcional solo en memoria.
- Diseño adaptable para escritorio y teléfono.
- Sin autenticación, pagos, almacenamiento de imágenes ni base de datos reales.

## Preparación para la siguiente fase

Los datos de demostración viven en `src/data/mockListings.js`. `src/services/listingRepository.js` define una interfaz asíncrona de catálogo; en la siguiente fase puede sustituirse por llamadas a una API y a la base de datos sin reescribir los componentes de la interfaz.

## Decisiones de producto

La versión prioriza una búsqueda visible, categorías por carrera, condiciones del artículo, reputación, verificación institucional y entrega dentro del campus. Estas decisiones se basan en los requerimientos proporcionados y en las 208 respuestas disponibles en la encuesta.
