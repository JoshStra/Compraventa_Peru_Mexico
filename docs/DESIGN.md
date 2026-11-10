# Diseño de CampusTrade

La guía completa aprobada para este incremento está en [DESIGN.md](../DESIGN.md). El concepto es un tablón de anuncios del campus: superficie crema, acciones teal y etiquetas perforadas para Venta, Renta, Intercambio y Donación.

## Implementación

- `frontend/src/styles.css`: tokens del producto y alias compatibles con los componentes existentes.
- `frontend/src/theme.css`: fuentes locales, capa visual, tarjetas, etiquetas, avisos, formularios, foco y adaptación móvil. Se importa después de `styles.css`.
- `frontend/src/assets/fonts/`: Inter y Fraunces variables latinas, con licencias originales OFL-1.1. No se consultan servicios externos de fuentes.
- `frontend/src/components/HomeHero.jsx`: portada y modalidades visibles, sin resaltar una palabra ni añadir encabezados decorativos.
- `frontend/src/connected/useCatalogNavigation.js` y `frontend/src/domain/catalogNavigation.js`: restauración de vistas, filtros y página desde la URL, historial de vistas y conservación del hash de enlaces de cuenta.
- `frontend/src/connected/Forms.jsx`: ayudas asociadas a contraseña y matrícula, control para mostrar la contraseña y conservación del foco al cambiar entre acceso, registro y recuperación.
- `frontend/src/connected/ConnectedApp.jsx`: error accesible de precios y bloqueo de consultas con mínimo mayor que máximo.

## Reglas de mantenimiento

Los colores nuevos se declaran como tokens; la interfaz no usa un segundo color de acción. El ámbar identifica intercambio o pequeños indicadores. Las etiquetas de modalidad no son botones.

El encabezado mantiene las opciones Inicio, Explorar, Favoritos, Mensajes, Operaciones y Perfil. Gestión corresponde exclusivamente al rol administrador. En móvil se distribuyen todas las opciones sin carrusel horizontal; bajo 440 px solo se ve la etiqueta activa, manteniendo los nombres completos para tecnologías de asistencia.

Las direcciones de catálogo usan `?vista=explorar&q=...&modality=rental&pagina=2`. Los parámetros se normalizan a los tipos y límites de consulta existentes. No se trasladan sesiones ni credenciales a la URL. Los tokens de verificación y recuperación conservan su canal `#verify=...` / `#reset=...` y siguen utilizando los flujos existentes.

Los enlaces de privacidad, ayuda y contacto esperan contenido y un canal aprobados por el responsable; no se inventaron políticas. El transporte de correo sigue pendiente por decisión previa del usuario. Esta entrega no incorpora pagos, carrito, endpoints, migraciones ni cambios en autenticación o sesiones.

## Validación

Después de modificar la interfaz, ejecutar `npm run build`, `npm test`, `npx prettier --check .` y las pruebas E2E pertinentes. Los casos de navegación, precio inválido, ayudas y las siete opciones a 320 px están en `frontend/e2e/design.spec.js`; usan el esquema PostgreSQL aislado del servidor de pruebas, con cuentas sintéticas.

La aplicación local se actualiza reconstruyendo el servicio `app` de Docker, conservando los volúmenes de datos e imágenes. No debe eliminarse ningún volumen para aplicar un diseño.
