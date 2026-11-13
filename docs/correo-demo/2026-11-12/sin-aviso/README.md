# Retiro del apartado visible de correo

El usuario solicitó eliminar el apartado de correo y recibir ideas para verificar el correo real. Se retiró la franja “Demostración local” de la página y el bloque del buzón de los formularios de inicio de sesión, registro y recuperación. El diálogo que consume un enlace local conserva la aclaración de que es una demostración.

Punto de partida limpio: `4f7a547`. Rama: `codex/retirar-aviso-correo-2026-11-12`. No se creó un commit vacío de respaldo. La configuración del transporte local se conserva y las opciones para un transporte real son propuestas, sin configurar proveedores nuevos.

## Validación

- [Frontend](frontend.txt): 57 pruebas aprobadas.
- [Compilación](build.txt): completada.
- [Navegador](e2e.txt): dos recorridos existentes del formulario de registro aprobados, uno en escritorio y otro en móvil.
- [Formato](format-check.txt): aprobado.
- [Inicio](inicio.jpg) y [acceso](acceso.jpg): revisión visual sobre la aplicación Docker reconstruida; el apartado del buzón ya no aparece.

El [primer intento de navegador](e2e-initial.txt) no pudo lanzar Chromium porque buscaba la caché predeterminada del usuario. Se repitió indicando `PLAYWRIGHT_BROWSERS_PATH` hacia `.playwright`, donde el proyecto ya tenía instalado el navegador. No fue necesario descargarlo ni modificar la aplicación para resolver ese error de entorno. El segundo intento completó los dos recorridos.

Los logs conservan las horas y resultados reales, con rutas locales sustituidas y saltos de línea normalizados. Las capturas no contienen sesiones autenticadas ni enlaces de verificación. [checksums.sha256](checksums.sha256) registra los archivos de esta evidencia. La validación anterior se conserva como histórica.
