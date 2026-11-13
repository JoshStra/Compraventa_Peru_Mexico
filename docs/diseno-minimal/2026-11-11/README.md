# CampusTrade · Diseño minimalista y buscador en la barra

Entrega del **11 de noviembre de 2026**, CampusTrade 0.3.0. Se implementó la [guía proporcionada por el usuario](../../../DESIGN.md), que sustituye el diseño crema y serif. El [resumen de mantenimiento](../../DESIGN.md) identifica sus componentes.

El árbol de Git estaba limpio antes de empezar: `9045e92` es el punto de respaldo, sin generar un commit vacío. Se trabajó en `codex/minimal-buscador-2026-11-11`, conservando `origin`, el historial y los horarios reales. Este incremento se guarda localmente; **no se hizo push a GitHub**.

## Cambios implementados

| Área                 | Resultado                                                                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base visual          | Fondo blanco, tinta casi negra, acciones teal, espacio y divisores finos. Tarjetas sin borde ni sombra; etiquetas de modalidad como texto.                                                                      |
| Tipografía           | Solo Inter variable local. Se retiraron Fraunces y su licencia del frontend; se conserva la licencia original de Inter.                                                                                         |
| Encabezado           | Buscador real «Buscar en el campus», Publicar, mensajes, favoritos y menú de cuenta. Acceso y creación de cuenta para visitantes.                                                                               |
| Cuenta               | Menú con foco inicial, flechas, Home/End, Escape y retorno al avatar; Perfil, publicaciones, favoritos, operaciones, verificación, Gestión para administradores y cierre de sesión.                             |
| Navegación móvil     | Cinco acciones: Inicio, Explorar, Publicar, Mensajes y Perfil. Favoritos, Operaciones y Gestión se alcanzan desde Perfil. Objetivos de al menos 44 px y etiquetas de 12 px.                                     |
| Catálogo             | Categorías Todo/Electrónica/Herramientas/Laboratorio/Libros, cuadrícula de dos columnas en móvil, precios compactos y estados de carga o vacío explícitos.                                                      |
| Filtros              | Panel lateral en escritorio e inferior en móvil, chips que se pueden quitar y campo «Buscar artículos» para refinar. Rango inválido asociado a sus campos y sin consulta al catálogo.                           |
| Detalle              | Dos columnas en escritorio; pantalla completa en móvil, imagen de 300 px y acción de mensaje al pie. Miniaturas seleccionables, vendedor, datos, guardado, solicitud, reporte y administración propia.          |
| Mensajes             | Lista y conversación separadas en móvil, regreso visible, cabecera con artículo, enlace a operaciones, historial desplazable y campo de envío al pie; se oculta la navegación inferior durante la conversación. |
| Perfil y operaciones | Filas y divisores sencillos; se conservan edición, publicaciones propias, actividad, solicitudes, calificaciones y moderación.                                                                                  |
| Compatibilidad       | Vista, filtros, consulta, página e historial conservan la URL. Se mantienen los hashes de verificación y recuperación y el comportamiento de foco de los diálogos.                                              |

No se modificaron el backend, los endpoints, el esquema, la autenticación ni las sesiones. No se añadieron pagos ni carrito.

## Pruebas ejecutadas

| Grupo       | Ejecución final                                                                                                                                                     | Evidencia                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Frontend    | **55 aprobadas**, siete archivos. Tres casos nuevos del encabezado: búsqueda/restauración, teclado del menú y opciones según el rol.                                | [unit-tests.txt](unit-tests.txt)                                               |
| Navegador   | **26 aprobadas**, trece escenarios en escritorio y móvil con Chrome instalado.                                                                                      | [e2e-tests.txt](e2e-tests.txt)                                                 |
| Compilación | Vite completó la compilación. Solo se empaqueta Inter; ya no se incluye Fraunces ni la imagen decorativa de la portada anterior.                                    | [build.txt](build.txt)                                                         |
| Formato     | Comprobación completa con Prettier.                                                                                                                                 | [format-check.txt](format-check.txt)                                           |
| Docker      | Imagen reconstruida y servicio `app` saludable; PostgreSQL conectado. Los cuatro archivos estáticos publicados coinciden por SHA-256 con la compilación verificada. | [docker-build.txt](docker-build.txt), [runtime-final.json](runtime-final.json) |
| Contraste   | Doce pares de texto opaco calculados, mínimo 4.89:1. No equivale a una auditoría WCAG completa.                                                                     | [contrast.json](contrast.json)                                                 |
| Secretos    | Inventario acotado de textos, compilado e historial accesible; no es una certificación de seguridad.                                                                | [secret-check.json](secret-check.json)                                         |

Los recorridos cubren búsqueda global, categorías y chips, precio inválido sin consulta, URL/recarga/historial, ayudas y contraseña del registro, cinco opciones móviles y administración a 320 px, publicación con imagen y edición persistente, favoritos entre sesiones, bloqueo de cuentas sin verificar, filtros, XSS representado como texto, devolución de renta vigente, chat entre dos sesiones y venta con calificación, reporte y resolución administrativa.

Las capturas E2E usan cuentas y artículos **sintéticos** dentro del esquema PostgreSQL aislado de pruebas. No se atribuyen a estudiantes reales ni se agregaron esos artículos al catálogo migrado. El primer intento no pudo iniciar porque Docker/PostgreSQL estaban detenidos; se conserva [el log](e2e-entorno-inicial.txt). Una ejecución restringida posterior tampoco tuvo acceso al puerto local; las ejecuciones finales con acceso al entorno completaron los casos.

La inspección visual encontró y corrigió dos reglas heredadas del chat: altura fija de cabecera que se encimaba con el artículo y altura máxima del historial que dejaba espacio bajo el campo de envío. El recorrido comprueba separación de cabecera, altura del campo de al menos 84 px y su posición al pie del móvil. La revisión de teclado corrigió el recorrido de foco para excluir controles ocultos y sus contenedores; el detalle comprueba Tab y Shift+Tab entre el cierre visible y el último control. También se retiró el ancho mínimo del cuerpo que provocaba desbordamiento con barras de desplazamiento clásicas: en un viewport de 320 px, el contenido y el ancho desplazable miden 305 px, sin desplazamiento horizontal de la página.

## Aplicación local y datos

El resultado está aplicado en **<http://127.0.0.1:3000/>**. Se reconstruyó únicamente el servicio `app`; los volúmenes `campustrade_postgres_data` y `campustrade_images_data` son los mismos antes y después. La evidencia está en [runtime-before.json](runtime-before.json) y [runtime-final.json](runtime-final.json). No se reactivaron los servicios de nube.

Se comprobó visualmente el sitio real en el navegador integrado, en escritorio y a 320 px. La [medición móvil](mobile-runtime-check.json) registra los cinco controles, sus dimensiones, la familia tipográfica, fondo blanco y ausencia de desbordamiento horizontal. Los datos de sesión no se incluyen en las evidencias.

## Límites que se conservan

- El dominio institucional es `itesa.edu.mx`. El proveedor de correo continúa pendiente por decisión del usuario; se muestra la indisponibilidad de envío y no se verifica automáticamente ninguna cuenta.
- El indicador de mensajes nuevos guarda por cuenta identificadores de conversación y fechas de lectura en este navegador. No guarda el contenido de mensajes, no se sincroniza entre dispositivos y no confirma lectura del destinatario. La consulta periódica existente se mantiene al abrir Mensajes.
- Privacidad, ayuda y contacto esperan contenido aprobado por el responsable. El despliegue es local en Docker.
- La validación incluye Chrome y el navegador integrado; no incluye entrevistas con estudiantes, Safari, lectores de pantalla ni certificación de accesibilidad.

## Capturas

- Sitio real de Docker: [escritorio](docker-inicio-escritorio.jpg) y [móvil a 320 px](docker-inicio-movil-320.jpg). El catálogo local está vacío; se conserva su estado real.
- Datos sintéticos E2E: [catálogo de escritorio](desktop-minimal-catalogo.png), [catálogo móvil](mobile-minimal-catalogo.png), [detalle móvil](mobile-minimal-detalle.png), [filtros](mobile-filtros-responsive.png), [mensajes móviles](mobile-mensajes.png), [perfil](mobile-perfil-postgresql.png), [operación finalizada](desktop-operacion-finalizada.png) y [administración](mobile-administracion-320.png).
- `checksums.sha256` registra la integridad de los archivos de esta carpeta.

## Repetir la validación

Con Docker y PostgreSQL locales activos y las dependencias instaladas:

```powershell
npm run build
npm test
npx prettier --check .
$env:PLAYWRIGHT_CHANNEL = 'chrome'
$env:E2E_EVIDENCE_DIR = Join-Path (Get-Location).Path 'docs/diseno-minimal/2026-11-11'
npm run test:e2e
```

La suite mantiene su aislamiento y limpieza de datos de pruebas. La actualización del diseño no requiere eliminar volúmenes.
