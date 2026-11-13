# 5 Resultados de pruebas

| Grupo | Aprobadas | Fallidas | Omitidas |
| --- | --- | --- | --- |
| Frontend | 57 | 0 | 0 |
| API | 54 | 0 | 0 |
| Navegador escritorio | 13 | 0 | 0 |
| Navegador móvil | 13 | 0 | 0 |
| Subtotal aplicación | 137 | 0 | 0 |
| Docker complementario | 9 | 0 | 0 |
| SMTP complementario | 5 | 0 | 0 |
| Total de registros | 151 | 0 | 0 |

La compilación Vite y la revisión de formato finalizaron correctamente. La instalación Docker responde con HTTP 200 y los cuatro archivos estáticos servidos coinciden por SHA256 con el build evaluado. Los servicios app, db y mailpit permanecen saludables y los volúmenes originales se conservan. Publicar sin sesión devuelve 401 y las rutas de verificación retiradas devuelven 404.

La línea INTERNAL_ERROR del log API corresponde al caso deliberado SEC-11, que provoca un fallo interno y comprueba una respuesta segura. No representa un error sin resolver de la suite. Las advertencias de colores del runner tampoco son casos fallidos.

El resultado acredita el entorno y los escenarios probados. No acredita carga sostenida, dispositivos físicos, todos los navegadores, entrega de correo institucional real ni aceptación con estudiantes externos.
