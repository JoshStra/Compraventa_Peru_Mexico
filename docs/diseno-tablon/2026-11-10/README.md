# Diseño «Tablón de anuncios del campus»

Entrega histórica del 10 de noviembre de 2026 sobre CampusTrade 0.3.0. La [guía de esa entrega](DESIGN_REFERENCIA.md) corresponde al documento proporcionado entonces por el usuario. El [diseño vigente](../../DESIGN.md) la sustituye desde el 11 de noviembre.

Antes de modificar la interfaz, se guardó la auditoría pendiente en el commit de respaldo `af2a011`, partiendo de `586d156`. El trabajo está en `codex/diseno-tablon-2026-11-10`, conservando `origin` e historial, con fechas reales. Este incremento se entrega en commits locales; no se hizo push a GitHub.

## Implementación

| Requisito           | Resultado                                                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concepto visual     | Fondo crema, superficies blancas, acción teal y estructura por bordes.                                                                                                                                                                      |
| Tipografía          | Inter y Fraunces variables latinas locales, con licencias originales. No se añadieron dependencias.                                                                                                                                         |
| Elemento distintivo | Etiquetas perforadas con los cuatro colores y lista accesible de modalidades en portada.                                                                                                                                                    |
| Componentes         | Tarjetas, categorías, filtros, formularios, avisos, ventanas, perfil, operaciones y pie comparten tokens y foco teal.                                                                                                                       |
| Navegación móvil    | Sin carrusel horizontal; las siete opciones de administrador caben a 320 px en los dos proyectos de pruebas. Bajo 440 px solo se muestra visualmente el texto activo; se conservan todos los nombres accesibles.                            |
| Precios inválidos   | Mensaje bajo los campos, `role=alert`, `aria-invalid`, `aria-describedby`; no se consulta el catálogo mientras mínimo supera máximo.                                                                                                        |
| URL e historial     | Vista, búsqueda, filtros y página se restauran al recargar; Atrás restaura la vista previa. Se conservan los hashes de verificación y recuperación.                                                                                         |
| Registro            | Ayudas de contraseña y matrícula asociadas a los campos; mostrar/ocultar contraseña conserva el valor y expone su estado. Al cambiar entre acceso, registro y recuperación, el foco permanece en la ventana y vuelve al origen al cerrarla. |
| Límites             | Se mantienen endpoints, esquema, autenticación, sesiones y funcionalidades. Sin pagos o carrito nuevos. No se inventaron políticas ni contactos.                                                                                            |

## Validación

- **52 pruebas de frontend aprobadas**, incluidas cinco nuevas comprobaciones de restauración, normalización y conservación de enlaces de cuenta.
- **24 recorridos E2E aprobados** con Chrome instalado: doce escenarios en escritorio y móvil. Los cuatro escenarios nuevos se ejecutan en ambos proyectos: precios, URL/historial, ayudas de registro y siete opciones administrativas a 320 px.
- Compilación Vite y construcción de imagen Docker satisfactorias. Tras el último ajuste de color de títulos se repitieron compilación, pruebas de frontend y comprobación visual en Docker.
- Comprobación de formato con Prettier. Inventario de secretos sin coincidencias en los textos de trabajo, compilado o historial examinados; es un análisis limitado, no una certificación.
- Doce pares de color de texto calculados con un mínimo de 4.5:1. El pie alcanza 8.12:1 y la acción principal 5.88:1; véase [contrast.json](contrast.json). No equivale a una auditoría WCAG completa.

Los recorridos E2E utilizan un esquema PostgreSQL aislado y cuentas sintéticas `campus.test`. Las capturas de administración, mensajes, perfiles y publicaciones corresponden a esas pruebas, no a estudiantes reales. La aplicación Docker mantiene el dominio institucional `itesa.edu.mx`.

La revisión manual detectó que cambiar de acceso a registro dejaba el foco en `body`. Se corrigió enfocando el primer campo del formulario nuevo después del cambio de modo y conservando el retorno de foco de la ventana. El caso E2E de registro comprueba los tres modos y el cierre con Escape.

El primer intento E2E no pudo arrancar por falta del ejecutable de Chromium gestionado por Playwright. Se utilizó el Chrome ya instalado mediante `PLAYWRIGHT_CHANNEL=chrome`; no se instaló otro navegador. Ese intento no constituye ejecución funcional del producto. Durante una ejecución simultánea con otras comprobaciones, una prueba de frontend agotó su límite de cinco segundos: se conserva [el resultado](unit-timeout-inicial.txt). La repetición y la ejecución posterior a los últimos ajustes completaron las 52 pruebas, sin modificar el límite de tiempo.

## Aplicación local

La imagen nueva está aplicada al servicio `app` en <http://127.0.0.1:3000/>. Los contenedores de aplicación y PostgreSQL están saludables. Se conservaron los volúmenes `campustrade_postgres_data` y `campustrade_images_data`; la actualización no elimina volúmenes ni crea datos de ejemplo en la base migrada. Los identificadores y verificaciones están en [runtime-before.json](runtime-before.json) y [runtime-final.json](runtime-final.json).

Los cambios de esta entrega cubren los hallazgos WEB-02, WEB-03, WEB-04, WEB-06 y WEB-07 de la [auditoría anterior](../../auditoria-sitio/2026-11-10/AUDITORIA_SITIO_WEB.md). La verificación real por correo sigue pendiente del proveedor que decida el usuario. Privacidad, ayuda y contacto esperan contenido aprobado por el responsable del proyecto.

## Evidencias

- [Portada actual en Docker](docker-inicio-escritorio.jpg) e [inicio a 320 px](docker-inicio-movil-320.jpg).
- [Error de precios a 320 px](docker-precio-invalido-320.jpg) y [registro institucional a 320 px](docker-registro-320.jpg).
- [Administración a 320 px](mobile-administracion-320.png): cuenta sintética de pruebas, con siete opciones disponibles.
- [Ayudas del registro](desktop-registro-con-ayudas.png), [filtros](mobile-filtros-responsive.png), [mensajes](desktop-mensajes.png), [operación](desktop-operacion-finalizada.png) y [moderación](desktop-administracion.png).
- Logs: [frontend](unit-tests.txt), [E2E](e2e-tests.txt), [compilación](build.txt), [Docker](docker-build.txt), [formato](format-check.txt) e [inventario de secretos](secret-check.json).
- `checksums.sha256` registra la integridad de los archivos de esta carpeta.

Para repetir los recorridos en esta computadora:

```powershell
npm run build
npm test
npx prettier --check .
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e
```

La suite general conserva sus reglas de aislamiento. Para guardar evidencia en una carpeta distinta puede definirse `E2E_EVIDENCE_DIR`. La comprobación del producto se realizó con Chrome y el navegador integrado; no incluye entrevistas con usuarios, Safari, lectores de pantalla o certificación de accesibilidad.
