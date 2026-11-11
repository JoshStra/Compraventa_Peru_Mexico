# DESIGN.md · CampusTrade

Guía de diseño para que una IA (Cursor, Claude Code, Codex, v0, Lovable) construya o modifique la interfaz de CampusTrade con coherencia. Léela completa antes de escribir código y respeta las reglas de la sección "Límites".

## 1. Producto

- **Qué es:** marketplace escolar donde estudiantes venden, rentan, intercambian y donan materiales académicos, con entrega acordada dentro del campus.
- **Público:** estudiantes universitarios de ingeniería (Automotriz, Industrias Alimentarias, Mecatrónica). Usan sobre todo el celular.
- **Categorías reales:** Electrónica, Herramientas, Laboratorio, Libros.
- **Modalidades:** Venta, Renta, Intercambio, Donación.
- **Trabajo principal de la interfaz:** que un estudiante encuentre un material en segundos o publique el suyo sin fricción, y que sienta confianza en quien está al otro lado.

## 2. Concepto visual

**Tablón de anuncios del campus.** Superficie crema como papel, un solo color de acción (teal) y etiquetas de modalidad con forma de etiqueta perforada. La personalidad vive en las etiquetas y en la tipografía de títulos; todo lo demás es tranquilo y legible.

Principios:

1. Un solo color de acción por pantalla: el teal. El ámbar nunca es un botón.
2. Una sola cosa memorable: las etiquetas de modalidad. No añadir más decoración.
3. Estructura por bordes finos, no por sombras. La sombra aparece solo al pasar sobre una tarjeta.
4. Calidez sin infantilizar: tono claro, directo, de compañero a compañero.
5. Mobile primero. Todo debe funcionar a 320 px.

## 3. Tokens

Pega este bloque en `:root` (ya existe en `frontend/src/styles.css`). No uses valores hexadecimales sueltos en componentes: usa siempre un token.

```css
:root {
  /* Color */
  --color-primario: #00716a;
  --color-primario-hover: #005650;
  --color-primario-oscuro: #003d39;
  --color-teal-claro: #e0f2f0;
  --color-acento: #f4a340;
  --color-fondo: #faf7f0;
  --color-superficie: #ffffff;
  --color-borde: #e3ddd0;
  --color-tinta: #1f2a29;
  --color-tinta-media: #3c4a48;
  --color-tinta-suave: #566664;
  --color-exito: #2e7d32;
  --color-error: #b42318;

  /* Etiquetas de modalidad */
  --tag-venta-fondo: #00716a;
  --tag-venta-texto: #ffffff;
  --tag-renta-fondo: #1f4e6b;
  --tag-renta-texto: #ffffff;
  --tag-intercambio-fondo: #f4a340;
  --tag-intercambio-texto: #3a2400;
  --tag-donacion-fondo: #e3f1d6;
  --tag-donacion-texto: #24500f;

  /* Tipografía */
  --font-display: "Fraunces Variable", Georgia, "Times New Roman", serif;
  --font-text:
    "Inter Variable", "Segoe UI", system-ui, -apple-system, Arial, sans-serif;

  /* Forma */
  --radius-card: 16px;
  --radius-control: 12px;
  --sombra-tarjeta: 0 6px 18px rgba(0, 61, 57, 0.1);
  --page-width: 1360px;
}
```

### Uso del color

| Token                     | Dónde                                                                    |
| ------------------------- | ------------------------------------------------------------------------ |
| `--color-primario`        | Botón principal, enlaces, ítem activo de navegación, foco                |
| `--color-primario-hover`  | Hover del botón principal                                                |
| `--color-primario-oscuro` | Títulos, precios, pie de página, franja superior                         |
| `--color-teal-claro`      | Fondos suaves, iconos de categoría, hover de tarjetas de categoría       |
| `--color-acento`          | Detalles pequeños: estrellas de calificación, punto de mensajes sin leer |
| `--color-fondo`           | Fondo de la página                                                       |
| `--color-superficie`      | Tarjetas, formularios, ventanas modales                                  |
| `--color-borde`           | Bordes y divisores                                                       |
| `--color-tinta`           | Texto principal                                                          |
| `--color-tinta-suave`     | Texto secundario, metadatos                                              |
| `--color-error`           | Mensajes de error (con fondo `#fdecea` en avisos)                        |

Aviso de verificación pendiente: fondo `#fff3df`, texto `#4a3100`, borde `#f1d6a2`.

### Contraste (medido)

Todo texto debe cumplir WCAG 2.2 AA (4.5:1 en texto normal). Pares verificados: blanco sobre `#00716a` 5.88:1, teal sobre crema 5.50:1, texto suave sobre crema 5.64:1, pie `#bcd9d5` sobre `#003d39` 8.12:1, error sobre blanco 6.57:1. Si añades un color, calcula su contraste antes de usarlo.

## 4. Tipografía

- **Títulos (h1, h2), precios, marca:** Fraunces variable, peso 600 a 650, interletraje `-0.012em` a `-0.02em`.
- **Todo lo demás (interfaz, cuerpo, títulos de tarjeta, botones):** Inter variable.
- Ambas se sirven desde `frontend/src/assets/fonts/` (archivos `.woff2` latinos, suficientes para acentos, ñ, ¿ y ¡). No cargar fuentes desde servicios externos.
- Títulos de tarjeta en Inter 18 px peso 600; el precio en Fraunces 24 px.

| Rol                    | Tamaño                                                      | Peso            |
| ---------------------- | ----------------------------------------------------------- | --------------- |
| Título de portada      | `clamp(40px, 5.2vw, 72px)`, móvil `clamp(34px, 10vw, 44px)` | 600             |
| Título de sección (h2) | 32 a 40 px                                                  | 600             |
| Título de tarjeta      | 18 px                                                       | 600             |
| Precio                 | 24 px                                                       | 650             |
| Cuerpo                 | 16 px (portada 18 px)                                       | 400             |
| Navegación             | 14 px                                                       | 500, activa 600 |
| Metadatos y ayudas     | 13 a 14 px                                                  | 400             |

Reglas:

- Texto en oración normal. **No** usar mayúsculas forzadas, ni etiquetas pequeñas sobre cada título.
- No resaltar una sola palabra de un título con otro color o cursiva.
- Líneas de menos de 80 caracteres. `text-wrap: balance` en el título de portada.
- Números de precio con `font-variant-numeric: tabular-nums` donde se alineen.

## 5. Layout

- Ancho máximo de página 1360 px, centrado. Márgenes laterales `max(4vw, 24px)`; en móvil 20 px.
- Alineación a la izquierda en todo el contenido. Nada centrado salvo la franja superior.
- Rejilla de productos: 4 columnas en escritorio, 3 bajo 1100 px, 2 bajo 900 px y 1 a 2 en móvil. Separación 24 px.
- Portada: dos columnas (texto e imagen) en escritorio; una columna bajo 900 px.
- Orden de la portada: franja "Comercio entre estudiantes. Entrega en el campus." → título → descripción → botones → etiquetas de modalidad → línea de confianza → categorías → recién publicados.

## 6. Componentes

### Encabezado y navegación

- Altura 72 px (64 px en móvil), fondo crema, borde inferior `--color-borde`.
- Marca: cuadro teal 34 px con "ct" en blanco, y "Campus" + "Trade" en Fraunces 24 px; "Trade" en teal.
- Opciones: Inicio, Explorar, Favoritos, Mensajes, Operaciones, Perfil, y Gestión solo para administradores.
- Activa: texto teal peso 600 y subrayado de 3 px teal.
- Sin sesión: botón secundario "Iniciar sesión". Con sesión: avatar circular con iniciales (fondo `--color-teal-claro`).
- **Móvil (≤650 px):** barra fija inferior de 64 px con icono y texto; las siete opciones deben caber a 320 px sin desplazamiento horizontal. Objetivos táctiles mínimos de 44 px. Bajo 440 px solo la opción activa muestra su texto; en las demás el texto queda oculto visualmente pero disponible para lectores de pantalla.

### Botones

- Radio 12 px, mínimo 48 px de alto, texto 16 px peso 600.
- **Primario:** fondo teal, texto blanco, hover `--color-primario-hover`. Uno por vista.
- **Secundario:** transparente, borde interior de 1.5 px teal, texto teal, hover `--color-teal-claro`.
- Enlaces de texto: teal, peso 600, subrayado desplazado 3 px.
- Verbo exacto y constante: "Publicar artículo", "Explorar artículos", "Crear cuenta", "Reenviar enlace". Nunca "Enviar" o "Aceptar" a secas.

### Etiquetas de modalidad (elemento firma)

- Forma de etiqueta: esquinas 4 px a la izquierda y 14 px a la derecha, con un punto perforado a la izquierda (círculo de 7 px con borde interior del color del texto y relleno crema).
- 13 px peso 600, relleno `8px 12px 8px 10px`.
- Sobre las fotos de las tarjetas: posición absoluta arriba a la izquierda (12 px).
- En portada: lista horizontal "Venta, Renta, Intercambio, Donación" con `aria-label="Formas de reutilizar"`.
- Colores: ver tokens `--tag-*`. Usar siempre estos cuatro, nunca otro color por modalidad.

### Tarjeta de producto

- Fondo blanco, borde 1 px `--color-borde`, radio 16 px.
- Imagen de 240 px de alto con fondo `#f1ede3`; si no hay foto, icono y texto "Sin fotografía".
- Botón de favorito: círculo blanco de 38 px arriba a la derecha; activo en teal con corazón relleno.
- Cuerpo (padding 18 px 20 px): carrera (13 px, suave), título (18 px), precio (Fraunces 24 px, teal oscuro), condición y estado (13 px), divisor y vendedor con avatar de iniciales y calificación con estrella ámbar.
- Hover: borde teal y `--sombra-tarjeta`. Sin movimiento.
- Precio: "Gratis" para donación, "Intercambio" para trueque, y para renta "$25.00 / día".

### Tarjeta de categoría

- Blanco, borde, radio 16 px, mínimo 96 px de alto. Icono en cuadro de 48 px con fondo `--color-teal-claro`, nombre y flecha teal.
- Hover: borde teal y fondo `--color-teal-claro`.

### Búsqueda y filtros

- Barra de búsqueda dentro de un contenedor blanco con borde y radio 16 px; el campo no lleva borde propio.
- Botón "Filtros" con borde, texto teal y `aria-expanded`.
- Panel de filtros: blanco, borde, radio 16 px, en rejilla. Campos: Carrera, Categoría, Modalidad, Condición, Disponibilidad, Precio mínimo, Precio máximo, y "Limpiar filtros".
- **Rango de precio inválido:** mostrar "El precio mínimo no puede ser mayor que el máximo." justo debajo de los dos campos (ocupa todo el ancho de la rejilla), con `role="alert"`, `aria-invalid` y `aria-describedby="error-precio"`. No consultar la API mientras el rango sea inválido.
- La vista, la búsqueda, los filtros y la página se reflejan en la URL (`?vista=explorar&q=...&categoryId=...&pagina=2`) y se restauran al recargar. Los enlaces de verificación y recuperación usan el `#hash` y no deben romperse.

### Formularios

- Campos blancos, borde 1 px `--color-borde`, radio 12 px; en foco, borde teal más el anillo de foco.
- Etiqueta arriba, ayuda debajo (13 px, suave) y error debajo (rojo). Ayuda y error se enlazan con `aria-describedby`.
- Registro: contraseña "Mínimo 12 caracteres."; matrícula "Entre 4 y 30 caracteres: letras, números y guiones."; enlace "Mostrar contraseña" / "Ocultar contraseña" con `aria-pressed`.
- Mantener las etiquetas exactas "Contraseña" y "Matrícula" (las pruebas E2E las buscan).

### Avisos

- **Verificación pendiente:** franja ámbar clara bajo el encabezado, "Tu correo institucional está pendiente de verificación." con enlace "Reenviar enlace".
- **Error global:** fondo `#fdecea`, texto rojo, `role="alert"`, con "Cerrar aviso".
- **Toast:** fondo teal oscuro, texto crema, radio 12 px, abajo al centro (sobre la barra en móvil).

### Estados vacíos

- Blanco con borde punteado `#c9c1ae`, radio 16 px, icono en círculo `--color-teal-claro`.
- Un título que invita y un botón. Ejemplo: "El catálogo está listo para tu primera publicación" + "Publicar artículo".
- Nunca mostrar tarjetas falsas como si fueran datos reales.

### Ventanas modales

- Fondo blanco, radio 20 px, velo `rgba(0, 40, 38, 0.45)`. Foco atrapado dentro, se cierra con Escape y devuelve el foco al botón de origen.

### Pie de página

- Fondo `--color-primario-oscuro`, texto `#bcd9d5` de 13 px; el nombre de la marca en crema.
- Pendiente: enlaces de privacidad, ayuda y contacto, solo cuando exista texto aprobado por el responsable del proyecto. No inventar políticas.

## 7. Movimiento

- Solo respuestas a una acción (hover, abrir, expandir). Transiciones de 160 ms en borde y sombra.
- Sin animaciones de entrada en secciones ni efectos decorativos.
- Respetar `prefers-reduced-motion` (ya implementado: desactiva transiciones y animaciones).

## 8. Accesibilidad (mínimos)

- WCAG 2.2 AA, idioma `es-MX`, enlace "Ir al contenido" al inicio.
- Foco visible: contorno teal de 3 px con desplazamiento de 3 px en todo elemento interactivo.
- Objetivos táctiles de al menos 44 px.
- Cada campo con etiqueta; errores asociados al campo; alertas con `role="alert"`.
- Imágenes informativas con `alt`; decorativas sin texto alternativo.
- Un solo `h1` por vista; encabezados en orden.

## 9. Voz y textos

- Español de México, sentido de compañero: claro, directo, sin jerga técnica.
- Oración normal (solo la primera palabra en mayúscula), verbos activos.
- Nombrar las cosas como las entiende el estudiante: "Publicar artículo", no "Crear registro".
- Un error dice qué pasó y cómo corregirlo, sin disculparse ni ser vago.
- Una acción conserva su nombre en todo el flujo: el botón "Publicar" produce el aviso "Publicado".
- Textos ya establecidos que se conservan: "Lo que ya no usas. Alguien lo necesita.", "Compra, renta, intercambia o dona materiales académicos con estudiantes de tu comunidad.", "Entrega en el campus."

## 10. Límites (qué no cambiar)

- No eliminar funcionalidades ni cambiar endpoints, esquema de base de datos, autenticación o sesiones.
- No inventar carrito, pagos ni funciones que el sistema no tiene.
- No instalar dependencias nuevas sin necesidad; las fuentes ya están incluidas como archivos.
- No renombrar clases ni etiquetas que usan las pruebas (`Contraseña`, `Matrícula`, nombres accesibles de la navegación, `Buscar artículos`, etc.).
- Tras cualquier cambio visual: `npm run build`, `npm test` y `npx prettier --check .` deben pasar.
- Trabajar en una rama con prefijo `codex/` y no usar push forzado.

## 11. Qué evitar

- Segundo color de acción o botones ámbar.
- Esquinas del mismo radio en todo, degradados decorativos y sombras en cada tarjeta.
- Mayúsculas forzadas, etiquetas pequeñas sobre cada título, números 01/02/03 sin que haya una secuencia real.
- Fondos oscuros en el contenido principal (el teal oscuro es solo para pie y franja).
- Texto gris claro sobre crema o blanco con menos de 4.5:1.

## 12. Archivos de referencia

- Tokens: `frontend/src/styles.css` (`:root`).
- Capa visual y componentes: `frontend/src/theme.css` (se importa después de `styles.css` en `main.jsx`).
- Fuentes: `frontend/src/assets/fonts/`.
- Interfaz conectada: `frontend/src/connected/ConnectedApp.jsx`; formularios: `frontend/src/connected/Forms.jsx`; portada: `frontend/src/components/HomeHero.jsx`.
- Resumen corto del sistema: `docs/DESIGN.md`.
