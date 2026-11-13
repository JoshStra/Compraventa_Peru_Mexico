# DESIGN.md · CampusTrade (Minimal · Buscador en la barra)

Guía para que una IA (Cursor, Claude Code, Codex, v0, Lovable) construya o modifique la interfaz de CampusTrade con este estilo. Léela completa antes de escribir código y respeta la sección "Límites". Sustituye a la guía anterior (crema y serif).

## 1. Producto

- **Qué es:** marketplace escolar donde estudiantes venden, rentan, intercambian y donan materiales académicos, con entrega acordada dentro del campus.
- **Público:** estudiantes universitarios de ingeniería (Automotriz, Industrias Alimentarias, Mecatrónica). Usan sobre todo el celular.
- **Categorías:** Electrónica, Herramientas, Laboratorio, Libros.
- **Modalidades:** Venta, Renta, Intercambio, Donación.
- **Secciones:** Inicio, Explorar, Favoritos, Mensajes, Operaciones, Perfil y Gestión (solo administradores).
- **Trabajo principal:** encontrar un material en segundos o publicar el propio sin fricción.

## 2. Concepto visual

**Tienda moderna, limpia y silenciosa.** Fondo blanco, una sola tipografía, un solo color (teal) y mucho espacio. La barra superior es mínima: marca, búsqueda y acciones. El contenido protagoniza; la interfaz casi no se nota.

Principios:

1. Blanco, tinta casi negra y teal. Nada más de color en la interfaz.
2. Estructura con espacio y líneas finas, no con bordes gruesos, sombras ni fondos de color.
3. Las tarjetas de producto no tienen borde: foto, texto y precio sobre el blanco.
4. La búsqueda es lo primero que se ve en cada pantalla.
5. Mobile primero: todo debe funcionar a 320 px.
6. Un solo botón principal por pantalla.

## 3. Tokens

```css
:root {
  /* Color */
  --color-fondo: #ffffff;
  --color-fondo-suave: #f2f6f5; /* campo de búsqueda */
  --color-foto: #eef3f2; /* marcador de foto, miniaturas */
  --color-borde: #e6eceb; /* divisores de 1 px */
  --color-borde-control: #cfdad8; /* chips y botones con contorno */
  --color-tinta: #111111; /* texto principal */
  --color-tinta-suave: #5b6a68; /* texto secundario */
  --color-primario: #00716a;
  --color-primario-hover: #005650;
  --color-primario-oscuro: #003d39;
  --color-teal-claro: #e0f2f0; /* chips activos, avisos suaves */
  --color-error: #b42318;
  --color-error-fondo: #fdecea;
  --color-aviso-fondo: #fff3df; /* verificación pendiente */
  --color-aviso-texto: #4a3100;

  /* Tipografía */
  --font-text: "Inter", "Segoe UI", system-ui, -apple-system, Arial, sans-serif;

  /* Forma */
  --radius-pill: 999px; /* búsqueda, botones, chips */
  --radius-foto: 8px; /* fotos de tarjeta */
  --radius-foto-grande: 10px; /* foto del detalle */
  --page-pad: 72px; /* margen lateral en escritorio */
}
```

### Uso del color

| Token                     | Dónde                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--color-primario`        | Botón principal, enlace activo, subrayado de pestaña, etiqueta de modalidad, avatar, aviso de mensajes nuevos |
| `--color-primario-hover`  | Hover y pulsado del botón principal                                                                           |
| `--color-primario-oscuro` | Texto sobre `--color-teal-claro`                                                                              |
| `--color-teal-claro`      | Chips de filtros aplicados                                                                                    |
| `--color-fondo-suave`     | Campo de búsqueda                                                                                             |
| `--color-foto`            | Fondo de fotos sin imagen y miniaturas                                                                        |
| `--color-tinta`           | Títulos, precios, texto principal                                                                             |
| `--color-tinta-suave`     | Metadatos, etiquetas de ficha, texto de ayuda                                                                 |
| `--color-borde`           | Líneas divisorias entre filas                                                                                 |

Contrastes verificados (WCAG AA, texto normal ≥ 4.5:1): tinta sobre blanco 18.9:1, `#5b6a68` sobre blanco 5.5:1, `#5b6a68` sobre `#f2f6f5` 4.9:1, blanco sobre `#00716a` 5.9:1, teal sobre blanco 5.9:1, `#003d39` sobre `#e0f2f0` 10:1. Si añades un color, calcula su contraste primero.

## 4. Tipografía

Una sola familia: **Inter** (variable, pesos 400, 500, 600 y 700). Sirve el archivo desde `frontend/src/assets/fonts/` (`inter-latin-wght-normal.woff2`); no cargues fuentes de servicios externos. Se eliminó Fraunces.

| Rol                               | Escritorio   | Móvil                  | Peso | Interletraje |
| --------------------------------- | ------------ | ---------------------- | ---- | ------------ |
| Título de portada (h1)            | 64 px / 1.05 | 38 px / 1.06           | 600  | -0.035em     |
| Título de página (Explorar, etc.) | 44 px        | 32 px                  | 600  | -0.03em      |
| Título de detalle                 | 44 px / 1.08 | 28 px / 1.1            | 600  | -0.03em      |
| Precio de detalle                 | 36 px        | 30 px                  | 600  | 0            |
| Título de tarjeta                 | 17 a 18 px   | 15 px                  | 600  | 0            |
| Precio de tarjeta                 | 17 a 18 px   | 15 px                  | 400  | 0            |
| Etiqueta de modalidad             | 13 px        | 13 px                  | 500  | 0            |
| Navegación y pestañas             | 15 a 16 px   | 12 px (barra inferior) | 500  | 0            |
| Metadatos y ayudas                | 13 a 14 px   | 13 px                  | 400  | 0            |

Reglas:

- Texto en oración normal. Sin mayúsculas forzadas ni etiquetas pequeñas sobre cada título.
- No resaltar una sola palabra de un título con otro color o cursiva.
- Líneas de menos de 80 caracteres. Titular de portada con `max-width` de 760 px.
- Números de precio con `font-variant-numeric: tabular-nums` donde se alineen.

## 5. Layout

- Fondo blanco. Margen lateral 72 px en escritorio y 20 px en móvil. Ancho máximo del contenido 1360 px.
- Alineación a la izquierda. Nada centrado salvo el buscador, que ocupa el centro de la barra.
- Rejilla de productos: 4 columnas en escritorio (separación 32 px), 3 bajo 1100 px, 2 bajo 900 px y en móvil. Separación móvil 16 px entre columnas y 18 px entre filas.
- Orden de la portada: barra → titular → pestañas de categorías → tarjetas recientes.
- Detalle en escritorio: dos columnas, foto (640 px) y ficha. En móvil: foto a todo el ancho (300 px de alto) y ficha debajo.

## 6. Componentes

### Barra superior (escritorio)

- Altura 88 px, fondo blanco, sin borde inferior (el espacio separa).
- De izquierda a derecha: marca "CampusTrade" (Inter 20 px peso 700, interletraje -0.02em); campo de búsqueda; acciones a la derecha.
- **Búsqueda:** píldora de 44 px de alto, fondo `--color-fondo-suave`, sin borde, texto "Buscar en el campus" en `--color-tinta-suave`, ancho máximo 560 px. En foco: anillo de 3 px teal.
- **Acciones con sesión:** "Publicar" (texto 15 px, peso 500), **Mensajes** (con punto teal si hay sin leer), **Favoritos** (corazón) y **avatar** circular de 40 px con iniciales en blanco sobre teal.
- **Menú del avatar** (desplegable): Mi perfil, Mis publicaciones, Operaciones, Verificación de cuenta, Gestión (solo administradores) y Cerrar sesión.
- **Sin sesión:** en lugar de Mensajes, Favoritos y avatar, "Iniciar sesión" (enlace) y "Crear cuenta" (botón principal pequeño).
- La página activa se indica con color teal y peso 600.

### Navegación móvil (≤650 px)

- Arriba: marca y avatar (44 px), debajo la búsqueda en píldora de 48 px. No hay otros botones arriba.
- Abajo: barra fija de 68 px, fondo blanco y línea superior de 1 px. Cinco opciones: **Inicio, Explorar, Publicar, Mensajes, Perfil**.
- **Publicar** es una píldora teal con texto blanco, la única opción con relleno. La opción activa va en teal peso 600.
- Objetivos táctiles de al menos 44 px. Texto de 12 px.
- **Favoritos y Operaciones** viven dentro de Perfil; Favoritos además se guarda desde el corazón de cada tarjeta y del detalle.
- **Detalle de artículo y conversación abierta:** la barra inferior se oculta y se reemplaza por una barra fija de 84 px con una acción principal ("Enviar mensaje").
- Mensajes con novedades: punto teal sobre la etiqueta.

### Pestañas de categoría

- Texto 16 px peso 500 en `--color-tinta-suave`; activa en `--color-tinta` con subrayado de 2 px teal y 8 px de separación. Separación entre pestañas 32 px (22 px en móvil, con desplazamiento horizontal).
- Primera pestaña "Todo".

### Tarjeta de producto

- Sin borde, sin fondo, sin sombra.
- Foto de 170 a 220 px de alto en escritorio (150 px en móvil), radio 8 px y fondo `--color-foto` si no hay imagen.
- Debajo: etiqueta de modalidad (13 px, teal, peso 500), título (600), precio (400). Carrera y condición en una línea de 13 px `--color-tinta-suave` cuando haya espacio.
- Corazón de favorito: círculo blanco de 36 px arriba a la derecha de la foto.
- Precio: "$280", "$25 / día", "Intercambio" y "Gratis" para donaciones.
- Hover (escritorio): el título se subraya. Sin elevación ni movimiento.

### Botones

- **Primario:** píldora, fondo teal, texto blanco 16 px peso 600, alto 52 px (48 px en barras pequeñas). Uno por pantalla. Hover `--color-primario-hover`.
- **Secundario:** píldora con borde de 1.5 px teal, fondo blanco, texto teal.
- **Enlace:** teal, peso 600, sin subrayado hasta el hover.
- Verbo exacto y constante: "Enviar mensaje", "Publicar artículo", "Explorar artículos", "Crear cuenta".

### Filtros y chips

- En Explorar: encabezado con título a la izquierda y, a la derecha, "Filtros" y "Más recientes ▾" (texto de 15 px, sin borde). Debajo, contador "8 resultados" (14 px, suave).
- En móvil: botón "Filtros" (píldora con borde `--color-borde-control`) y, a su lado, chips de filtros aplicados con fondo `--color-teal-claro`, texto `--color-primario-oscuro` y "×".
- Panel de filtros (hoja inferior en móvil, panel lateral o desplegable en escritorio): Carrera, Categoría, Modalidad, Condición, Disponibilidad, Precio mínimo y máximo, "Limpiar filtros".
- **Rango de precio inválido:** mostrar "El precio mínimo no puede ser mayor que el máximo." justo bajo los dos campos, con `role="alert"`, `aria-invalid` y `aria-describedby`. No consultar la API mientras el rango sea inválido.
- La vista, la búsqueda, los filtros y la página se reflejan en la URL (`?vista=explorar&q=...&categoryId=...&pagina=2`) y se restauran al recargar. Los enlaces de verificación y recuperación usan el `#hash` y no deben romperse.

### Detalle de artículo

- Ruta de migas en 14 px: "Explorar / [Categoría]".
- Foto grande con miniaturas de 96 × 72 px debajo.
- Ficha: etiqueta de modalidad, título, precio, filas con divisores de 1 px (Carrera, Condición, Entrega: etiqueta a la izquierda en suave, valor a la derecha), vendedor con avatar de 44 px y calificación, y botones "Enviar mensaje" (primario) y "Guardar" (secundario).
- En móvil: encabezado con "‹ Atrás" y "Guardar", y la barra fija inferior con "Enviar mensaje".

### Mensajes (propuesta; falta diseñarla en detalle)

- **Escritorio:** dos columnas, lista de conversaciones a la izquierda y chat a la derecha, con la tarjeta del artículo fijada arriba del chat.
- **Móvil:** lista de conversaciones; al abrir una, pantalla completa sin barra inferior.
- Desde la conversación nacen las acciones de operación ("Solicitar", "Reservar", "Calificar").

### Operaciones y Perfil (propuesta; falta diseñarlas en detalle)

- **Perfil en móvil:** menú de filas con divisores: Mis publicaciones, Favoritos, Operaciones, Verificación, Gestión (admin) y Cerrar sesión.
- **Operaciones:** lista en filas con estado en texto, sin tarjetas.

### Formularios

- Campos con borde 1 px `--color-borde-control`, radio 12 px, alto mínimo 48 px y fondo blanco; en foco, borde teal y anillo de foco.
- Etiqueta arriba, ayuda debajo (13 px, suave) y error debajo (rojo). Ayuda y error enlazados con `aria-describedby`.
- Registro: contraseña "Mínimo 12 caracteres.", matrícula "Entre 4 y 30 caracteres: letras, números y guiones.", enlace "Mostrar contraseña" / "Ocultar contraseña" con `aria-pressed`.
- Mantén las etiquetas exactas "Contraseña" y "Matrícula" (las pruebas E2E las buscan).

### Avisos y estados

- **Verificación pendiente:** franja delgada bajo la barra, fondo `--color-aviso-fondo`, texto `--color-aviso-texto`: "Tu correo institucional está pendiente de verificación." con enlace "Reenviar enlace". Evita botones que fallan sin explicación mientras la verificación esté pendiente.
- **Error global:** fondo `--color-error-fondo`, texto `--color-error`, `role="alert"`, con "Cerrar aviso".
- **Toast:** fondo tinta `#111`, texto blanco, píldora, abajo al centro (sobre la barra inferior en móvil).
- **Estado vacío:** texto centrado en el área de contenido, un título que invita y un botón principal. Ejemplo: "Aún no hay publicaciones" + "Publicar artículo". Nunca tarjetas falsas.
- **Carga:** bloques de `--color-foto` con la forma de la tarjeta, sin animaciones llamativas.

### Ventanas modales

- Fondo blanco, radio 20 px, velo `rgba(0, 0, 0, 0.4)`. Foco atrapado dentro, se cierra con Escape y devuelve el foco al botón de origen.

### Pie de página

- Fondo blanco, línea superior de 1 px, texto 13 px `--color-tinta-suave`.
- Pendiente: enlaces de privacidad, ayuda y contacto, solo cuando exista texto aprobado por el responsable del proyecto. No inventar políticas.

## 7. Movimiento

- Solo respuestas a una acción: hover, abrir menús y hojas, cambiar pestaña. Transiciones de 150 ms.
- Sin animaciones de entrada ni efectos decorativos.
- Respetar `prefers-reduced-motion`.

## 8. Accesibilidad (mínimos)

- WCAG 2.2 AA, idioma `es-MX`, enlace "Ir al contenido" al inicio.
- Foco visible: contorno teal de 3 px con desplazamiento de 3 px en todo elemento interactivo.
- Objetivos táctiles de al menos 44 px.
- Cada campo con etiqueta; errores asociados; alertas con `role="alert"`.
- Imágenes informativas con `alt`; decorativas sin texto alternativo.
- Un solo `h1` por vista; encabezados en orden.
- La búsqueda de la barra es un campo real con etiqueta accesible ("Buscar en el campus").

## 9. Voz y textos

- Español de México, de compañero: claro, directo y sin jerga técnica.
- Oración normal, verbos activos. Nombrar las cosas como las entiende el estudiante.
- Un error dice qué pasó y cómo corregirlo.
- Un botón conserva su nombre en todo el flujo.
- Textos establecidos: "Lo que ya no usas, otro lo necesita.", "Compra, renta, intercambia o dona materiales con estudiantes de tu campus.", "Entrega en el campus."

## 10. Límites (qué no cambiar)

- No eliminar funcionalidades ni cambiar endpoints, esquema de base de datos, autenticación o sesiones.
- No inventar carrito, pagos ni funciones que el sistema no tiene.
- No instalar dependencias nuevas sin necesidad; Inter se incluye como archivo.
- No renombrar clases ni etiquetas que usan las pruebas (`Contraseña`, `Matrícula`, nombres accesibles de la navegación, `Buscar artículos`, etc.).
- Cambiar de barra de siete opciones a barra superior mínima y barra inferior de cinco opciones afecta la navegación existente: conserva el acceso a todas las secciones (Favoritos y Operaciones dentro de Perfil en móvil) y revisa las pruebas E2E.
- Tras cualquier cambio visual: `npm run build`, `npm test` y `npx prettier --check .` deben pasar.
- Trabajar en una rama con prefijo `codex/` y sin push forzado.

## 11. Qué evitar

- Segundo color de acento, degradados, sombras en tarjetas y bordes gruesos.
- Tarjetas con borde y fondo de color: aquí la foto y el espacio hacen el trabajo.
- Mayúsculas forzadas, etiquetas pequeñas sobre cada título y números 01/02/03 sin secuencia real.
- Fondos oscuros en el contenido principal.
- Texto gris claro con menos de 4.5:1.
- Más de un botón principal por pantalla.

## 12. Archivos de referencia en el proyecto

- Tokens: `frontend/src/styles.css` (`:root`). Los nombres actuales (`--color-fondo`, `--color-primario`, etc.) se mantienen; cambian sus valores.
- Capa visual: `frontend/src/theme.css`, que se importa después de `styles.css` en `main.jsx`.
- Fuentes: `frontend/src/assets/fonts/` (conservar Inter y quitar Fraunces).
- Interfaz conectada: `frontend/src/connected/ConnectedApp.jsx`; formularios: `frontend/src/connected/Forms.jsx`; portada: `frontend/src/components/HomeHero.jsx`.
- Diseño de referencia en el lienzo: tableros "Minimal · Buscador en la barra", "Buscador · Explorar", "Buscador · Detalle" y "Móvil · Inicio / Explorar / Detalle".
