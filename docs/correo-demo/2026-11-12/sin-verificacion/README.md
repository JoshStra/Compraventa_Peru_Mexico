# Retiro del apartado de verificación

Incremento desde el punto de partida limpio `6c62c63`, en la rama `codex/retirar-aviso-correo-2026-11-12`. El usuario solicitó eliminar el apartado de verificación y recibir ideas para verificar el correo real.

Se retiraron el aviso global de cuenta pendiente, el botón de reenvío, el acceso “Verificación de cuenta” del menú y del perfil, y los textos del estado de verificación en el perfil propio. Se eliminaron su estado, función y estilos sin uso. Se conservan el correo de contacto, edición de perfil y acceso administrativo. Los permisos de la API y los estados de cuentas existentes siguen vigentes: ocultar la sección no verifica a nadie ni habilita publicar a cuentas pendientes.

Las [propuestas de verificación real](../../../OPCIONES_VERIFICACION.md) describen enlace, código, acceso institucional y aprobación administrativa. No se configuró un proveedor nuevo.

## Validación ejecutada

- [Frontend](frontend.txt): 57 pruebas aprobadas, incluido el menú sin el acceso retirado.
- [Navegador](e2e.txt): seis recorridos aprobados, tres en escritorio y tres en móvil. Comprueban el perfil sin apartado y sin recorte, conservación del bloqueo para publicar sin verificar, registro con enlace de un uso y publicación persistente, y acceso a Gestión con una cuenta administrativa sintética.
- [Compilación](build.txt) y [formato](format-check.txt): aprobados.
- [Instalación local](runtime.json): API HTTP 200 y cuatro archivos servidos por Docker con hashes iguales al nuevo compilado.
- Revisión visual del [perfil de escritorio](perfil-escritorio.png) y [perfil móvil](perfil-movil.png), con cuentas sintéticas de esquema aislado. La información de contacto y edición se conserva; el apartado retirado no aparece.

El [intento inicial de E2E](e2e-initial.txt) no encontró pruebas porque npm consumió el argumento `--grep` al reenviarlo al workspace. Se ejecutó directamente el CLI local de Playwright, con el mismo código de aplicación y la caché `.playwright` existente; los seis recorridos terminaron aprobados. La incidencia fue del comando de ejecución, no una prueba funcional fallida.

Comandos usados para la validación:

```powershell
npm test
npm run build
npm run format:check
$env:PLAYWRIGHT_BROWSERS_PATH=(Resolve-Path .playwright).Path
$env:E2E_EVIDENCE_DIR=(Join-Path (Get-Location).Path 'tmp/sin-verificacion/capturas')
node node_modules/@playwright/test/cli.js test --config=frontend/playwright.config.js --grep 'perfil sin apartado|cinco opciones móviles|registro verificación'
```

La aplicación Docker se reconstruyó mediante `docker compose up -d --no-deps --build --wait app`; la base y sus volúmenes se conservaron. No hubo cambios de permisos o credenciales, ni operaciones sobre servicios de nube o GitHub. Los logs mantienen resultados y tiempos reales, sustituyen las rutas del equipo por `<REPO>` y normalizan saltos de línea y espacios al final. [checksums.sha256](checksums.sha256) permite comprobar esta evidencia.
