# CampusTrade · Galería blanca

Implementado el 9 de noviembre de 2026 a partir de la referencia visual «Apple (España) — white museum gallery at noon» proporcionada por el responsable. La referencia orienta la apariencia; CampusTrade conserva su marca, contenido y funciones de comercio universitario.

## Aplicación al sistema

- Portada compartida entre la aplicación conectada y la demostración explícita: fotografía editorial, titular amplio con acento verde y acciones Explorar/Publicar.
- Superficies blancas sobre lienzo `#f5f5f7`, texto `#1d1d1f`, separadores finos y tarjetas de 28 px. Sin sombras CSS ni degradados.
- Botones principales azules `#0071e3`, secundarios grises y enlaces `#0066cc`. Tipografía del sistema, pesos 400/600 y controles legibles.
- Catálogo, filtros, formularios, perfiles, mensajes, operaciones y Gestión utilizan el mismo lenguaje visual. Las fotografías subidas por los propietarios permanecen disponibles; los artículos sin imagen muestran «Sin fotografía».
- En móvil, una columna para productos y navegación inferior desplazable cuando las siete opciones del administrador exceden el ancho. Se mantienen foco visible y preferencia de movimiento reducido.
- Los iconos de categorías se relacionan con su nombre, independientemente del orden del catálogo.

El diseño no cambia roles, sesiones, permisos, API ni verificaciones institucionales. La configuración productiva de `itesa.edu.mx` y el proveedor de correo pendiente conservan su comportamiento.

## Imagen editorial y procedencia

Generada con la herramienta integrada `image_gen`, mediante la habilidad imagegen; no se utilizó la CLI ni una clave API. La composición representa materiales académicos genéricos y no corresponde a una publicación real, disponibilidad o precio del catálogo.

- Activo incluido en el código: [`frontend/src/assets/campus-essentials.webp`](../frontend/src/assets/campus-essentials.webp), 1200 × 800, aproximadamente 88 KB.
- Original local conservado: `C:/Users/Alexm/.codex/generated_images/01a18a57-666a-73f3-82ca-7d07d3e0224d/exec-ce6c6168-0039-4372-ba2c-dfbed664e54d.png`.
- Optimización posterior: redimensionado y codificación WebP con Sharp, sin alterar la composición.

Prompt final utilizado:

```text
Use case: product-mockup. Asset type: editorial hero image for CampusTrade, a university marketplace. Create one photorealistic optical product photograph, landscape composition, of three modest unbranded university textbooks with ivory, pale gray and muted sage covers in a low stack and one graphite scientific calculator leaning beside the stack. All objects fully visible, three-quarter angle, accurate physical materials and fine paper texture. Pure white seamless background and white surface, soft bright midday studio light, only very faint natural contact shading. Subjects occupy about 70 percent of the frame with generous clean white margins. Quiet white museum gallery aesthetic. No text, slogans, readable book titles, brands, logos, people, plants, room or furniture. No illustration, CGI, 3D render, floating cards, decorative shapes, frames, gradients or artificial drop shadows. This is an original editorial image, not a photograph of a specific live listing. Save the generated image normally so it can be copied into the project.
```

## Validación

Punto de partida: `1d3ee43f803527a5f20e67cb878f03b16ac4a724`, con árbol de Git limpio. No se creó un commit vacío de respaldo.

Las evidencias de esta revisión están en [`entregables/rediseno_galeria`](../entregables/rediseno_galeria/README.md). Los documentos y capturas de entregas anteriores conservan sus fechas y resultados originales.
