# Validación del registro sin confirmación

Cambio solicitado el 12 de noviembre de 2026: retirar la confirmación de correo para utilizar CampusTrade. Punto de partida limpio `3341d8c`, rama `codex/sin-confirmacion-correo-2026-11-12`; no se creó un respaldo vacío.

Se retiraron los bloqueos de API e interfaz para publicar, subir imágenes, conversar y operar. El registro conserva dominio exacto, matrícula, contraseña y respuesta genérica, y no envía correo ni crea tokens de verificación. Se retiraron los endpoints, el consumo de enlaces y las insignias. La herramienta de promoción administrativa exige cuenta existente y activa, con asignación explícita y auditoría. Este incremento no promovió cuentas ni cambió sus credenciales o valores históricos de verificación. No hubo migraciones de esquema.

## Pruebas ejecutadas

| Alcance                         | Resultado                                                                                         | Evidencia                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Frontend                        | 57 pruebas aprobadas                                                                              | [frontend.txt](frontend.txt)                                 |
| API con PostgreSQL aislado      | 54 pruebas aprobadas                                                                              | [api.txt](api.txt)                                           |
| Navegador de escritorio y móvil | 26 recorridos aprobados, con cuentas registradas que no consumen enlaces de verificación          | [e2e.txt](e2e.txt)                                           |
| Docker desechable               | Nueve comprobaciones aprobadas; volúmenes desechables retirados                                   | [docker-smoke.json](docker-smoke.json)                       |
| SMTP real a Mailpit             | Cinco comprobaciones aprobadas, con cuenta y esquema desechables                                  | [smtp-smoke.json](smtp-smoke.json)                           |
| Compilación y formato           | Aprobados                                                                                         | [build.txt](build.txt), [format-check.txt](format-check.txt) |
| Instalación local aplicada      | Cuatro assets coinciden con el compilado, servicios saludables y volúmenes existentes conservados | [runtime.json](runtime.json)                                 |

Regresión de aplicación: **137 pruebas aprobadas**, además de nueve comprobaciones Docker y cinco SMTP. La línea `INTERNAL_ERROR` de API corresponde al caso deliberado SEC-11 que verifica errores seguros; la suite final tiene cero fallos.

Los recorridos prueban registro e inicio de sesión directos, creación y edición con imagen, chat entre dos sesiones, operaciones, calificaciones y moderación. Ya no utilizan fixtures que activen `verified_at`. Se mantienen pruebas de CSRF, propiedad, participación, suspensión, dominio completo y prohibición de asignar roles desde registro.

La recuperación mantiene caducidad, sustitución del enlace, uso único incluso con solicitudes concurrentes y revocación de sesiones. Se comprueba que las rutas retiradas responden 404 y que un token histórico de propósito `verify` no puede recuperar una contraseña. El script SMTP también comprueba ausencia de correo al registrar, publicación sin confirmación y conservación de los usuarios existentes mediante comparación antes/después de identificadores, roles, verificación histórica y suspensión. Sus mensajes y esquema se eliminan al terminar; no se imprimen contraseñas ni tokens.

## Revisión visual

Las capturas [publicación y perfil de escritorio](perfil-escritorio.png) y [mensajes en móvil](mensajes-movil.png) provienen de las pruebas con cuentas sintéticas. Muestran actividad funcional sin confirmación ni insignias de verificación.

## Alcance y reproducción

Los [resultados del inventario acotado de secretos](security-summary.json) excluyen binarios y archivos mayores de 3 MB; no son una certificación de seguridad. La configuración privada permanece fuera de Git. Los logs conservan resultados y tiempos reales, con rutas locales sustituidas por `<REPO>`, saltos de línea normalizados y espacios finales retirados. Las fechas UTC de los logs corresponden a las ejecuciones reales; la fecha de esta entrega usa America/Mexico_City.

```powershell
npm test
npm run test:api
npm run build
$env:PLAYWRIGHT_BROWSERS_PATH=(Resolve-Path .playwright).Path
$env:E2E_EVIDENCE_DIR=(Join-Path (Get-Location).Path 'tmp/sin-confirmacion/capturas')
npm run test:e2e
npm run test:docker
Get-Content scripts/mail-demo-smoke.mjs -Raw | docker compose exec -T app node --input-type=module
npm run format:check
```

Solo se reconstruyó `app` en la instalación local. No se reactivaron servicios de nube ni se publicaron cambios remotos. [REGISTRO_SIN_CONFIRMACION.md](../../REGISTRO_SIN_CONFIRMACION.md) describe el comportamiento; [checksums.sha256](checksums.sha256) conserva la integridad de esta evidencia. El dominio admitido no demuestra control del buzón ni pertenencia institucional. Los reportes anteriores conservan sus cortes históricos.
