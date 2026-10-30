# Historial de cambios de CampusTrade

## 0.3.0-rc.1 — 30 de octubre de 2026

- Primera versión integrada React/Express/PostgreSQL: cuentas institucionales configurables, sesiones HttpOnly revocables, CSRF y recuperación/verificación con tokens de un uso.
- Publicaciones y favoritos compartidos, imágenes validadas hasta 5 MB con referencias externas, mensajes privados, operaciones transaccionales, rentas/devoluciones, intercambios, calificaciones, reportes y administración con auditoría.
- Corrección de separación de componentes (#1) y de cancelación de ofertas retiradas/fechas civiles de renta (#2).
- Validación: 47 pruebas frontend, 30 PostgreSQL/API, 10 recorridos de navegador en dos tamaños y compilación. Se conservan logs y capturas auténticas.
- Despliegue gratuito preparado con Render y Neon; no publicado por falta de cuentas conectadas y S3. Correo real pendiente por decisión del responsable. Sin PR revisados; candidata de fuentes, no entrega productiva completa.

## 0.2.0 versión de trabajo

### Funciones

- Publicaciones favoritos perfil mensajes y reportes conservados en el navegador.
- Edición de publicaciones propias y disponibilidad con finalización irreversible desde la interfaz.
- Carga opcional de imágenes locales con validación de tamaño formato y firma.
- Filtros por categoría precio y disponibilidad; búsqueda que ignora acentos.
- Perfil editable con estadísticas derivadas de los datos y exportación JSON.

### Correcciones

- Publicar ya no usa un evento React después de await.
- Se rechazan campos con espacios precios inválidos y opciones fuera de catálogo.
- Los mensajes enviados se muestran en su conversación y se recuperan al recargar.
- Se informa de errores de guardado y de datos dañados.
- Las búsquedas vacías muestran el mensaje correspondiente.
- Los comandos npm funcionan desde la raíz y preview sirve el mismo compilado de Vite.
- Los modales permiten Escape y gestionan el foco.

### Ingeniería

- Pruebas de dominio repositorio React y navegador en escritorio y móvil.
- Plantillas para bugs y PR; workflows de validación y despliegue manual.
- Arquitectura backlog e incidencias documentados en docs.

Esta entrada describe cambios locales. La release de GitHub y el despliegue deben crearse después de una revisión real.

## Iteraciones anteriores del diseño

### Iteración 1: Fase de Diseño Estático

- Creación de la estructura base en HTML5 y CSS3.
- Diseño de la interfaz de usuario con enfoque _Mobile First_.

### Iteración 2: Migración a React y Componentes

- Configuración del entorno de desarrollo utilizando Vite[cite: 1].
- Creación del componente principal `App.jsx` y punto de entrada `main.jsx` para modularizar la vista[cite: 1].

### Iteración 3: Datos Simulados (Mocking)

- Integración de `mockListings.js` para visualizar el catálogo de publicaciones y categorías sin depender de un backend[cite: 1].

### Iteración 4: Especificación Técnica y Arquitectura

- Definición de la arquitectura de 3 capas (Presentación, Aplicación, Servicios, Datos)[cite: 1].
- Estructuración de los endpoints de la futura API REST bajo `/api/v1`[cite: 1].
- Propuesta del modelo de base de datos relacional con entidades principales como `User`, `Listing` y `Operation`[cite: 1].
