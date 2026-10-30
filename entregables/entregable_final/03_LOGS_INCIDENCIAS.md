# Bitácora de incidencias y validaciones

Fecha de ejecución: 2026-10-30, zona America/Mexico_City. Se omiten credenciales, tokens y datos personales. Los fixtures campus.test son sintéticos. Los fallos intermedios se conservan en esta bitácora aunque la validación final sea correcta.

| ID / módulo / severidad | Observado y reproducción | Diagnóstico | Solución y commit | Prueba / estado |
|---|---|---|---|---|
| INC-01 CI / media | GitHub Actions falló en 82c6954 y 4c4a5d2 al comprobar formato. | Diferencias CRLF y formato de callbacks. | endOfLine auto y rutas formateadas en 15164a2/15452f9. | format:check y CI posteriores correctos. |
| INC-02 imágenes / media | Imagen válida convertida pero sendFile devolvía 404. | La carpeta .data era excluida como dotfile por Express. | Permitir ruta controlada de servidor al servir la imagen; be03335. | listings.test.js comprueba WebP real 200 y acceso privado. |
| INC-03 enlaces / alta | Abrir #verify después de cargar la app no cambiaba el diálogo. | El estado solo se inicializaba al montar. | Listener hashchange; c4e2553. | Registro y verificación E2E en escritorio/móvil. |
| INC-04 pruebas E2E / baja | Reporte no avanzaba por selector Detalle; luego coincidían dos resoluciones de diferentes pruebas. | El control se llama Describe el problema; datos compartidos entre proyectos. | Usar etiqueta real y acotar al artículo concreto; ff48d53. | 10/10 E2E correctas; fallo de prueba, no de permisos. |
| INC-05 operaciones / alta | Oferta retirada continuaba pending. Reproducido por prueba antes de corregir. | UPDATE ignoraba offered_listing_id. | Cancelar ambos vínculos en transacción; 6b0d297, issue #2. | Regresión pasa; API 30/30. |
| INC-06 rentas / media | API emitía instante con hora para un DATE. | Conversión automática de pg dependiente de zona. | to_char YYYY-MM-DD; 6b0d297, issue #2. | Igualdad exacta de inicio/fin y renta/devolución correctas. |
| EXT-01 GitHub / media | Conector devuelve Resource not accessible by integration (403) al comentar/cerrar. | Permisos de integración insuficientes. | API oficial con autenticación Git existente, sin exponer secretos. | Issues 1 y 2 leídos como closed, un comentario cada uno. |
| EXT-02 correo / bloqueo | No hay proveedor ni remitente autorizado. | Decisión del responsable: dejar pendiente. | Adaptadores Resend/SMTP preparados; no bypass de verificación. | Transporte aislado probado; envío real pendiente. |
| EXT-03 despliegue / bloqueo | Render/Neon sin conexión autorizada y S3 sin credenciales. | Dependencia externa. | render.yaml y procedimiento preparados. | No existe URL pública comprobada. |

## Validaciones de contenido observadas en pruebas reales

| Entrada / caso | Esperado | Obtenido | Evidencia |
|---|---|---|---|
| Registro sintético campus.test en entorno de pruebas | 201, verified=false | 201, sin verificación inventada | auth.test.js |
| Dominio ajeno, contraseña corta, role=admin, email duplicado | 400/409, sin privilegios | Rechazados | auth.test.js |
| Título con espacios, precio inválido, categoría inválida | 400, campos explicados | Rechazados | listings.test.js |
| Usuario tercero intenta editar o leer mensajes | 403, sin datos privados | Rechazado | listings.test.js, conversations.test.js |
| SVG con extensión PNG o formato/extensión incompatibles | 400 | 400 | listings.test.js |
| Imagen mayor de 5 MB | 413 | 413 | listings.test.js |
| PNG válido, propio y de tamaño permitido | 201 y GET WebP 200 tras publicar | 201/200 | listings.test.js, fullstack.spec.js |
| Dos aceptaciones simultáneas | Una 200 y otra 409; una reserva | Coincide | operations.test.js |
| Calificar antes de finalizar / repetir | 409 | 409 | operations.test.js |
| Renta sin fechas; renta válida y devolución por propietario | Rechazar sin fechas; conservar importe y liberar tras devolución válida | Coincide | operations.test.js |
| Texto de mensaje entre participantes válidos | 201, persiste y llega al otro | Coincide | conversations.test.js, workflows.spec.js |
| Resolución administrativa válida | Guardar y mostrar al reportante | Coincide en móvil/escritorio | workflows.spec.js |

## Logs

Los archivos `pruebas-frontend.txt`, `pruebas-api.txt`, `pruebas-navegador.txt`, `compilacion.txt`, `formato.txt` y `dependencias.txt` en evidencias contienen comandos, fechas reales y salidas de la validación final. [CI de la interfaz](https://github.com/JoshStra/Compraventa_Peru_Mexico/actions/runs/41093113611). Historial de ejecuciones fallidas disponible en [Actions](https://github.com/JoshStra/Compraventa_Peru_Mexico/actions), sin presentar esos intentos como aprobados. La prueba entre procesos verifica persistencia, sin afirmar que se haya probado recuperación ante desastre.
