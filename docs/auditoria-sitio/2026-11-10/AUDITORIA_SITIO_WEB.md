# Auditoría del sitio web CampusTrade

**Fecha:** 10 de noviembre de 2026, zona America/Mexico_City.  
**Sistema revisado:** CampusTrade 0.3.0, instalación Docker en <http://127.0.0.1:3000/>.  
**Código de referencia:** commit local `586d156`, rama `codex/docker-local-2026-11-10`.  
**Evaluador:** Codex, mediante inspección técnica y recorridos exploratorios. No corresponde a entrevistas ni a comentarios de estudiantes reales.

## Dictamen

CampusTrade tiene una presentación visual cuidada y una base funcional adecuada para continuar la evaluación académica en esta computadora. El diseño comunica con claridad su propósito: vender, rentar, intercambiar y donar materiales entre estudiantes, con entrega acordada dentro del campus.

**El principal bloqueo para incorporar estudiantes reales es el correo institucional pendiente.** El sitio reconoce `itesa.edu.mx`, pero el transporte de correo no está configurado. Por ello, una cuenta nueva no puede completar por sí misma la verificación necesaria para publicar, escribir mensajes o solicitar operaciones. Es una activación pendiente conocida, que el usuario decidió dejar pendiente; esta revisión no la modifica.

También se confirmaron problemas concretos de explicación de errores, contraste y conservación de la navegación. La evaluación visual favorable no implica que todos los flujos estén validados con usuarios reales ni constituye una certificación de accesibilidad o seguridad.

## Alcance y método

- Navegación anónima en la aplicación Docker real: inicio, catálogo, filtros, acceso, registro y recuperación como opciones visibles.
- Revisión de escritorio a 1440 × 900, móvil a 320 × 800 y 390 × 844, y una comprobación geométrica a 768 × 1024.
- Manejo del teclado en la ventana de acceso: ciclo de Tab/Shift+Tab, Escape y devolución del foco al botón de origen.
- Consultas HTTP de solo lectura para salud, catálogo, publicaciones, sesión, administración y recursos estáticos.
- Inspección del código de React, API, configuración Docker y evidencia ya existente de pruebas.

No se crearon cuentas, publicaciones, mensajes ni operaciones en la base migrada. No se cambió código de aplicación, configuración, credenciales o servicios remotos. El árbol de Git estaba limpio al iniciar, con `586d156` como referencia; no se necesitó un commit vacío de respaldo.

## Cómo está organizado el sitio

| Módulo         | Propósito y estado observado                                                                                                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio         | Presentación, acciones «Explorar artículos» y «Publicar artículo», categorías y publicaciones recientes. Revisado en navegador.                                                                                                     |
| Explorar       | Búsqueda, filtros por carrera, categoría, modalidad, condición, disponibilidad y precio; resultados paginados. Revisado con catálogo vacío.                                                                                         |
| Favoritos      | Guardar artículos asociados a la cuenta. El acceso anónimo solicita iniciar sesión; implementación y evidencia previa disponibles.                                                                                                  |
| Mensajes       | Conversaciones privadas vinculadas a publicaciones; actualización por consultas cada diez segundos, según el código. No se envió un mensaje en esta revisión.                                                                       |
| Operaciones    | Solicitudes, reservas, ventas, rentas, intercambios, donaciones y calificaciones. Revisado en código y evidencia previa, sin ejecutar operaciones nuevas.                                                                           |
| Perfil         | Datos del estudiante, publicaciones propias y estado de verificación. Requiere sesión.                                                                                                                                              |
| Administración | Existe dentro del mismo sitio como «Gestión», visible para el rol `admin`. Incluye reportes, usuarios, publicaciones, reservas y catálogos. Se comprobó rechazo HTTP 401 al acceso anónimo; no se inició sesión como administrador. |
| Cuentas        | Registro, inicio de sesión, verificación y recuperación. Dominio institucional configurado; envío de correo pendiente.                                                                                                              |

La interfaz usa React y Vite; una API Node.js/Express atiende las solicitudes y PostgreSQL conserva los datos. Docker ejecuta la aplicación y la base, con volúmenes para PostgreSQL e imágenes. La aplicación se publica únicamente en loopback: el uso local actual responde a la solicitud del usuario y no se considera un defecto de despliegue.

## Aspectos que funcionan bien

1. **Jerarquía visual clara.** Fondo blanco, títulos grandes, fotografía pertinente, espacio entre secciones y acciones principales reconocibles. Los textos explican las cuatro modalidades y el punto de entrega.
2. **Consistencia.** Botones, iconos, tarjetas, formularios y ventanas comparten un estilo uniforme. La navegación principal mantiene los mismos nombres en escritorio y móvil.
3. **Estados vacíos honestos.** El catálogo avisa que no hay publicaciones y ofrece una acción para comenzar. No muestra artículos ficticios como si fueran datos reales.
4. **Base de accesibilidad útil.** Idioma `es-MX`, encabezados, etiquetas de campos, texto alternativo en la imagen principal, enlace para saltar al contenido, alertas y estados de carga. La ventana de acceso conserva el foco al usar Tab, cierra con Escape y devuelve el foco al origen.
5. **Adaptación de formularios y filtros.** En 320 px, los filtros quedan dentro de la página y el registro permite desplazamiento vertical dentro de la ventana. Los campos de registro tienen texto de 16 px.
6. **Estado técnico comprobado.** Aplicación y base aparecen `healthy`; la API informa PostgreSQL conectado. El panel administrativo rechaza la consulta sin autenticar. Se observaron CSP, `nosniff`, `no-referrer` y `no-store` en API; no se expone `X-Powered-By`.

## Hallazgos y correcciones recomendadas

Las prioridades son de producto y usabilidad: **P1** bloquea una tarea esencial; **P2** debe corregirse antes de una prueba amplia con estudiantes; **P3** mejora claridad o eficiencia. No son puntuaciones CVSS.

### WEB-01 · P1 · La incorporación de estudiantes depende de un correo no activado

**Evidencia:** `/api/v1/auth/session` devuelve `emailDeliveryConfigured: false`; el catálogo anuncia `itesa.edu.mx`. La configuración Compose no incorpora un proveedor de correo. El código exige verificación antes de publicar, escribir o solicitar operaciones.

**Consecuencia:** comprobar el dominio de una dirección no demuestra que el estudiante controle ese buzón. El registro puede almacenar una cuenta, pero su ciclo de activación queda incompleto. La recuperación por correo tampoco puede entregar un enlace real.

**Acción propuesta:** cuando el usuario defina proveedor y remitente, conectar el transporte y probar registro → recepción → verificación → publicación, además de recuperación y expiración de enlaces. Mantener las cuentas sin verificar mientras tanto. Comunicar la indisponibilidad antes de que el visitante complete el registro, conservando respuestas genéricas que no revelen cuentas existentes.

**Criterio de cierre:** una cuenta de prueba autorizada recibe el enlace real, puede consumirlo una sola vez y obtiene únicamente los permisos previstos. No se cierra este punto con la validación del sufijo del correo.

### WEB-02 · P2 · El filtro de precios oculta la explicación concreta del error

**Reproducción ejecutada:** Explorar → Mostrar filtros → mínimo `200` → máximo `100`.

**Resultado:** aparece «Revisa los campos indicados», sin señalar un campo ni explicar la relación inválida. La API sí responde HTTP 400 con `fields.minPrice: "El precio mínimo supera al máximo."`; la interfaz no presenta ese detalle. Véanse [captura](02-catalogo-rango-invalido.jpg) y [respuesta técnica](technical-checks.json).

**Acción propuesta:** validar el rango antes de consultar, mostrar el mensaje junto a los precios y asociarlo mediante `aria-describedby`/`aria-invalid`. Distinguir un error de consulta de un resultado vacío.

**Criterio de cierre:** el usuario identifica el precio que debe corregir y el mensaje desaparece al establecer un rango válido. Este caso debe alinearse con la identificación de errores descrita por [WCAG 3.3.1](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html).

### WEB-03 · P2 · El texto secundario del pie tiene contraste insuficiente

**Evidencia:** versión y lema usan `#707070` sobre `#1d1d1f`, con tamaño de 12 px. La relación calculada a partir de estilos efectivos es **3.3985:1**. Para texto normal, [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) establece un mínimo de 4.5:1. El CTA azul principal sí alcanza aproximadamente 4.70:1 en su estado observado.

**Acción propuesta:** aclarar el color secundario del pie y comprobar los demás estados y componentes. No reducir la evaluación al CTA principal.

**Criterio de cierre:** versión y lema alcanzan al menos 4.5:1 en escritorio y móvil. No se afirma conformidad WCAG completa a partir de esta única comprobación.

### WEB-04 · P2 · Las vistas y filtros no se conservan en la URL

**Evidencia:** al abrir Explorar y cambiar filtros, la dirección sigue en `/`. Al recargar desde esa vista, vuelve Inicio. `ConnectedApp.jsx` conserva vistas y filtros en estado de React; el hash se utiliza para enlaces de verificación y recuperación.

**Consecuencia:** no se puede compartir directamente una búsqueda ni conservarla mediante una recarga. Los cambios de vista tampoco generan entradas propias para el historial del navegador. La recarga se comprobó; el comportamiento completo de Atrás/Adelante se deduce del código, no se presentó como una prueba adicional ejecutada.

**Acción propuesta:** representar vistas, filtros y detalles compartibles mediante rutas o parámetros, con títulos de página adecuados y conservación de los enlaces de cuenta existentes.

**Criterio de cierre:** una URL de catálogo con filtros restaura la misma consulta tras recargar; Atrás y Adelante recorren las vistas de forma predecible.

### WEB-05 · P2 · Falta información de privacidad y ayuda accesible desde la interfaz

**Evidencia:** el registro solicita nombre, correo, matrícula, carrera y semestre. En las vistas públicas y el registro revisados no hay enlaces de privacidad, ayuda o contacto; el pie solo contiene marca, versión y lema.

**Consecuencia:** el estudiante no puede conocer desde ese recorrido qué uso se dará a sus datos ni dónde pedir apoyo sobre cuentas, entregas o reportes.

**Acción propuesta:** incorporar información propia del proyecto sobre tratamiento de datos y un canal de soporte definido, además de instrucciones de intercambio y entrega. El contenido debe ser aprobado por la persona responsable. Este hallazgo describe transparencia y usabilidad; no es un dictamen jurídico.

**Criterio de cierre:** se puede abrir esa información desde registro y pie; el contacto conduce a un canal real y definido.

### WEB-06 · P3 · «Perfil» queda parcialmente fuera de la barra en 320 px

**Evidencia:** la barra mide aproximadamente 305 px de ancho útil, pero sus seis opciones ocupan 348 px. Tiene `overflow-x: auto`; «Perfil» comienza en x=290 y termina en x=348. Se puede alcanzar desplazando horizontalmente. A 390 px no se observó ese desbordamiento interno.

**Consecuencia:** en pantallas estrechas puede pasar inadvertida la última opción. No se considera un botón inaccesible ni un desbordamiento de toda la página.

**Acción propuesta:** ajustar la distribución para seis opciones o mostrar una señal clara de desplazamiento; comprobar también la opción adicional «Gestión» con una cuenta administradora.

**Criterio de cierre:** todas las opciones se descubren y alcanzan con facilidad en 320 px, tanto con teclado como en dispositivo táctil. La prueba táctil física queda pendiente.

### WEB-07 · P3 · El registro no explica de antemano algunos requisitos

**Evidencia:** la contraseña exige al menos doce caracteres y la matrícula usa el patrón `[A-Za-z0-9-]{4,30}`, pero no hay ayuda visible asociada a esos requisitos antes del error. El dominio autorizado sí se explica correctamente.

**Acción propuesta:** indicar longitud de contraseña y formato de matrícula junto a sus campos; añadir una opción accesible para mostrar u ocultar la contraseña.

**Criterio de cierre:** se conocen los requisitos antes del envío y la ayuda queda asociada al campo. No se comprobó la tasa de abandono con personas reales.

### WEB-08 · P3 · Hay optimizaciones pendientes para un uso más amplio

**Evidencia estática y HTTP:** la búsqueda actualiza los filtros en cada cambio y el efecto solicita el catálogo sin una espera breve para agrupar pulsaciones. Cancela la solicitud anterior, lo cual reduce respuestas obsoletas, pero no evita iniciar peticiones. Los cuatro recursos compilados consultados responden sin `Content-Encoding`, incluso al solicitar gzip/br, y con `max-age=0`.

| Recurso consultado                 | Bytes sin compresión HTTP |
| ---------------------------------- | ------------------------: |
| JavaScript de entrada              |                    142425 |
| JavaScript de aplicación conectada |                     62445 |
| CSS                                |                     35625 |
| Imagen WebP principal              |                     88108 |

**Acción propuesta:** agrupar las pulsaciones de búsqueda con una espera breve; evaluar compresión y caché prolongada para recursos con hash al preparar otro despliegue. Conservar `no-store` para la API y los datos privados.

**Criterio de cierre:** medir solicitudes durante escritura y rendimiento con red móvil simulada. Esta sesión no ejecutó Lighthouse, Core Web Vitals de campo ni pruebas de carga; los tiempos HTTP locales no representan la experiencia de todos los usuarios.

## Evidencia ejecutada y límites

| Comprobación de esta sesión                                             | Resultado                                                                                                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Cinco consultas públicas: HTML, salud, catálogo, publicaciones y sesión | HTTP 200; PostgreSQL conectado; versión 0.3.0.                                                                                     |
| Consulta anónima de administración                                      | HTTP 401 `AUTH_REQUIRED`; rechazo correcto.                                                                                        |
| Dominio y catálogos                                                     | `itesa.edu.mx`, cuatro categorías y tres carreras activas.                                                                         |
| Estado de publicaciones                                                 | Cero resultados; estado vacío visible. No se concluye que búsqueda, ordenamiento o paginación con datos hayan quedado revalidados. |
| Rango mínimo 200 / máximo 100                                           | La API rechaza el rango; la explicación detallada se pierde en la interfaz.                                                        |
| Teclado de ventana de acceso                                            | Tab y Shift+Tab circulan dentro; Escape cierra y devuelve foco a «Iniciar sesión».                                                 |
| Recarga desde Explorar                                                  | Vuelve Inicio; estado de vista no conservado.                                                                                      |
| Filtros y registro en 320 px                                            | Sin desbordamiento de página; registro con desplazamiento vertical interno.                                                        |
| Navegación en 320 px                                                    | Desplazamiento horizontal interno necesario para ver «Perfil» completo.                                                            |
| Inicio a 390 y 768 px                                                   | Comprobación geométrica sin desbordamiento horizontal de página.                                                                   |
| Contraste del pie                                                       | 3.3985:1; insuficiente para texto normal.                                                                                          |
| Consola del sitio durante el recorrido                                  | No se recogieron avisos ni errores de aplicación en la consulta de consola realizada.                                              |

Como antecedente, la entrega Docker del mismo día conserva **50 pruebas API, 47 de frontend y 9 recorridos Docker aprobados** en [su evidencia](../../docker-local/2026-11-10/migration.json). Son 106 comprobaciones previas; **no se volvieron a ejecutar ni se suman como nuevas en esta auditoría**. Los recorridos de mensajería, publicaciones, operaciones y administración con datos sintéticos están documentados previamente, pero no sustituyen una evaluación con estudiantes reales.

El catálogo migrado está vacío. Por ello esta revisión visual no evalúa la calidad de fotografías de vendedores, títulos largos reales, resultados numerosos, conversaciones extensas ni actividad administrativa real. Tampoco incluye Safari, Firefox, lectores de pantalla o pruebas táctiles físicas.

## Contexto operativo y de seguridad

Docker conserva base e imágenes en volúmenes; detener un contenedor no equivale a eliminar sus datos. La instalación está configurada para esta computadora. No se propone exponerla a Internet como parte de esta auditoría.

El registro de migración anterior documenta Render suspendido, Supabase pausado y Neon conservado como respaldo. No se consultaron otra vez los paneles remotos en esta sesión. La auditoría de seguridad previa mantiene pendiente la rotación de una credencial remota y la reducción de privilegios de su rol en Neon; el usuario eligió posponer la rotación. Esos pendientes no se cierran por haber migrado a Docker. El rol local sí fue configurado sin SUPERUSER, CREATEDB, CREATEROLE ni BYPASSRLS. Véanse [auditoría de seguridad](../../../SECURITY_AUDIT.md) y [guía Docker](../../DOCKER_LOCAL.md).

## Orden de trabajo sugerido

1. Resolver WEB-01 cuando el usuario defina el servicio de correo. Hasta entonces, mantener explícita la limitación de verificación.
2. Corregir explicación de precios y contraste del pie, con una comprobación específica de cada corrección.
3. Incorporar rutas conservables, privacidad y ayuda propias del proyecto.
4. Ajustar navegación estrecha y ayudas del registro; después medir rendimiento con escenarios representativos.
5. Realizar un piloto con estudiantes autorizados, registrar fecha, módulo, acción, resultado y comentario, distinguiendo sus opiniones de las de Codex.

## Archivos de evidencia

- [Inicio de escritorio](01-inicio-escritorio.jpg).
- [Filtro de precios inválido](02-catalogo-rango-invalido.jpg).
- [Registro de escritorio](03-registro-escritorio.jpg).
- [Registro en móvil de 320 px](04-registro-movil-320.jpg).
- [Filtros en móvil de 320 px](05-filtros-movil-320.jpg).
- [Inicio en móvil de 320 px](06-inicio-movil-320.jpg).
- [Inicio en móvil de 390 px](07-inicio-movil-390.jpg).
- [Lecturas HTTP](http.json), [mediciones técnicas](technical-checks.json), [DOM móvil](dom-mobile.json), [filtros móviles](mobile-filters.json) y [otras dimensiones](responsive.json).
- `checksums.sha256`: integridad de los artefactos de esta carpeta.

Este informe y las nuevas evidencias son archivos locales. No se creó un commit ni se hizo push a GitHub durante esta auditoría. El código y el funcionamiento del sitio permanecen en el commit de referencia indicado.
