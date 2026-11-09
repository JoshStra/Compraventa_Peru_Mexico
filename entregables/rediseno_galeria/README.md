# Rediseño de CampusTrade · 9 de noviembre de 2026

## Alcance y entorno

Aplicación de la referencia de galería blanca a la interfaz existente. Validación local con React compilado, Express y PostgreSQL en `127.0.0.1:55432`, esquemas desechables y correo de pruebas. Las cuentas `campus.test` y las publicaciones que aparecen en las capturas son datos sintéticos locales. No son usuarios ni operaciones de producción.

Los comentarios de revisión corresponden a Codex como evaluador técnico automatizado; no se atribuyen a estudiantes reales.

## Pruebas ejecutadas

| Grupo | Acción y resultado esperado | Resultado obtenido | Estado | Evidencia |
| --- | --- | --- | --- | --- |
| Frontend | Ejecutar regresiones de interfaz, validación y cliente HTTP; conservar comportamiento | 47 de 47 pruebas correctas | Aprobada | [frontend.txt](evidencias/frontend.txt) |
| API y PostgreSQL | Ejecutar autenticación, permisos, publicaciones, operaciones, moderación y configuración productiva | 34 de 34 pruebas correctas | Aprobada | [api.txt](evidencias/api.txt) |
| Navegador | Registrar, verificar en entorno de pruebas, publicar con imagen, editar, guardar favoritos y recuperar tras recargar | Correcto en escritorio y Pixel 7 | Aprobada | [e2e.txt](evidencias/e2e.txt), capturas `*-perfil-postgresql.png` |
| Mensajes y operaciones | Intercambiar mensajes entre sesiones, solicitar, aceptar, finalizar y calificar | Mensajes compartidos, venta finalizada y calificación persistida en ambos tamaños | Aprobada | Capturas `*-mensajes.png` y `*-operacion-finalizada.png` |
| Administración | Reportar contenido y guardar una resolución desde Gestión; visible para el reportante | Reporte resuelto con comentario en ambos tamaños | Aprobada | Capturas `*-administracion.png` |
| Seguridad de cuenta | Intentar publicar con cuenta sin verificar | Acción bloqueada y sin insignia falsa en ambos tamaños | Aprobada | [e2e.txt](evidencias/e2e.txt) |
| Composición visual | Abrir portada, acceso, catálogo y Gestión en navegador integrado | Imagen cargada de 1200 px; botones sin sombras; sin errores de consola observados | Aprobada | Capturas JPG de esta carpeta |
| Adaptación móvil | Revisar a 390 px y catálogo/Gestión a 320 px; comprobar ancho del documento y acceso al menú | Sin desbordamiento del documento; siete opciones de Gestión accesibles en barra desplazable | Aprobada | [validacion-responsive.json](evidencias/validacion-responsive.json) |
| Compilación y formato | Construir la distribución y revisar el formato del repositorio | Vite compila correctamente; Prettier sin diferencias | Aprobada | [build.txt](evidencias/build.txt), [format.txt](evidencias/format.txt) |

Total de regresiones automatizadas: **91** (47 frontend + 34 API + 10 recorridos E2E). Las comprobaciones visuales son adicionales y no aumentan artificialmente ese total.

## Comentarios de revisión

1. La portada presenta una acción principal clara, Explorar artículos, y una acción secundaria para publicar. La imagen editorial acompaña al titular sin representar inventario real.
2. Los formularios conservan etiquetas visibles, contraste y foco azul; el catálogo muestra una indicación neutra cuando falta una fotografía.
3. La jerarquía y el espacio entre tarjetas facilitan leer el contenido en móvil. La barra inferior permite acceder a Gestión sin ocultar funciones del administrador.
4. Los recorridos de mensajes, operaciones y resolución de reportes continúan funcionando después del cambio visual.

## Reproducción

Con dependencias y PostgreSQL local configurados:

```powershell
npm run build
npm test
npm run test:api
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.playwright'
$env:E2E_EVIDENCE_DIR = Join-Path (Get-Location) 'entregables/rediseno_galeria/evidencias'
npm run test:e2e
npm run format:check
```

`E2E_EVIDENCE_DIR` permite guardar cada revisión en su carpeta sin sustituir las evidencias históricas. Las pruebas rechazan conexiones a PostgreSQL remoto.

La referencia, decisiones de estilo y prompt de la imagen se documentan en [DESIGN_REFERENCE.md](../../docs/DESIGN_REFERENCE.md).

## Publicación real

Publicado en [CampusTrade](https://campustrade-mex-per.onrender.com/) el **9 de noviembre de 2026 a las 14:15:21 CST**, commit `3a55ee7c29827902712812b09c9f1fcc76728d68`. [Render confirma Deploy succeeded | Live](evidencias/despliegue/render-live.jpg), despliegue `dep-dbp2j6mk1f9s73a1m230`, duración 1 min 3 s. El servicio mantiene su plan Free y la configuración existente.

Las [ocho comprobaciones HTTPS](evidencias/despliegue/https.json) fueron aprobadas: health/PostgreSQL, dominio autorizado exacto `itesa.edu.mx`, portada/cabeceras de seguridad, entradas de la distribución y cuatro recursos estáticos con SHA-256 idéntico al build local del commit desplegado. La [compilación del commit publicado](evidencias/despliegue/build-commit-desplegado.txt) complementa el build previo de la revisión local; sus nombres finales de recursos son los utilizados en producción.

Capturas productivas: [portada](evidencias/despliegue/portada-publica.jpg), [página completa](evidencias/despliegue/portada-publica-completa.jpg) y [dominio institucional](evidencias/despliegue/dominio-institucional.jpg). La revisión del navegador no registró errores de consola. No se realizaron escrituras productivas ni se verificaron artificialmente usuarios. El proveedor real de correo permanece pendiente.

El commit documental posterior registra estas evidencias en main; auto-deploy está apagado, por lo que el código publicado sigue siendo `3a55ee7`.
