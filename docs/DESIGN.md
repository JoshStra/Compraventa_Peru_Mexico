# Diseño de CampusTrade

La [guía completa](../DESIGN.md) define el diseño minimalista vigente desde el 11 de noviembre de 2026: fondo blanco, Inter local, texto casi negro y teal como color de acción. Sustituye el diseño crema y serif, conservado como [referencia histórica](diseno-tablon/2026-11-10/DESIGN_REFERENCIA.md).

## Implementación

- `frontend/src/styles.css` contiene los tokens y alias compatibles; `theme.css` aplica tipografía, componentes y adaptación móvil.
- `frontend/src/assets/fonts/` sirve Inter variable con su licencia original. No se consultan servicios externos de fuentes.
- `MinimalHeader.jsx` contiene la búsqueda real «Buscar en el campus», acciones de escritorio y menú de cuenta accesible por teclado. En móvil se muestran Inicio, Explorar, Publicar, Mensajes y Perfil; Favoritos, Operaciones y Gestión se alcanzan desde Perfil. Gestión requiere el rol administrador.
- `CatalogControls.jsx` reúne categorías, filtros en panel lateral o inferior y chips removibles. El formulario de filtros conserva el nombre accesible «Buscar artículos». Los precios inválidos muestran un error asociado y bloquean la consulta.
- `ListingDetail.jsx` muestra fotografía y ficha en dos columnas; en móvil ocupa la pantalla y fija la acción de mensaje. Mantiene favoritos, solicitudes, reportes y administración de publicaciones propias.
- `Messenger.jsx` abre la conversación a pantalla completa en móvil y ofrece regreso a la lista. Conserva envío, historial, consulta periódica y acceso al artículo y sus operaciones.
- `useReadMarkers.js` guarda únicamente identificadores de conversación y su fecha de lectura por cuenta en este navegador. El punto de mensajes nuevos no se sincroniza entre dispositivos ni representa confirmación de lectura del destinatario.
- `ConnectedApp.jsx` integra perfil y operaciones como filas sencillas; conserva edición, publicaciones, calificaciones y moderación.

## Reglas de mantenimiento

Una sola familia tipográfica y un solo color de acción. Las tarjetas no tienen borde ni sombra; las etiquetas de modalidad son texto teal. Los colores de errores y verificación pendiente mantienen su significado. Los componentes de diálogo conservan su control de foco, Escape y retorno al elemento que los abrió.

Las direcciones de catálogo usan `?vista=explorar&q=...&modality=rental&pagina=2`. Se conservan la restauración de vista, filtros, página, historial y los hashes `#verify=...` / `#reset=...`. Sesiones y credenciales no se trasladan a la URL.

El dominio institucional sigue siendo `itesa.edu.mx`. El envío real de verificación permanece pendiente del proveedor elegido por el responsable; la interfaz lo explica y no verifica usuarios automáticamente. Privacidad, ayuda y contacto esperan contenido aprobado. Este incremento no incorpora pagos, carrito, endpoints, migraciones ni cambios de autenticación o sesiones.

## Validación y aplicación

Ejecutar `npm run build`, `npm test`, `npx prettier --check .` y las pruebas E2E pertinentes. Los escenarios usan PostgreSQL aislado y cuentas sintéticas. La [entrega y sus evidencias](diseno-minimal/2026-11-11/README.md) documentan los resultados reales.

La aplicación local se actualiza reconstruyendo únicamente el servicio `app` de Docker, conservando los volúmenes existentes de PostgreSQL e imágenes.
