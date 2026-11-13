# 5. Resultados de pruebas

| Grupo | Aprobadas | Fallidas | Omitidas |
| --- | --- | --- | --- |
| Frontend | 55 | 0 | 0 |
| API | 50 | 0 | 0 |
| Navegador escritorio | 13 | 0 | 0 |
| Navegador móvil | 13 | 0 | 0 |
| Total | 131 | 0 | 0 |

Los trece escenarios conectados cubren precios y ARIA, URL/historial, registro y foco, navegación móvil/roles, búsqueda/chips/detalle, publicación con imagen, favoritos, bloqueo de cuenta pendiente, filtros, XSS como texto, renta vigente, mensajes/venta/calificación y reportes administrativos.

Comprobaciones complementarias: compilación Vite correcta; aplicación y PostgreSQL saludables; los cuatro recursos estáticos publicados coinciden por SHA-256 con el build; dominio configurado itesa.edu.mx; proveedor de correo sin configurar. Estas comprobaciones de entorno no se agregan a los 131 casos.

La revisión del diseño registró los defectos del apartado 3, ya corregidos. No se reutilizan cifras históricas de 101 pruebas ni se presenta el despliegue local como producción HTTPS. El resultado técnico no acredita carga sostenida, todos los navegadores, entrega real de correo ni aceptación con estudiantes.
