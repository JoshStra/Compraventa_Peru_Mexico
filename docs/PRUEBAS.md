> Documento histórico de la alfa local 0.2.0. Estado full stack vigente: [TESTING.md](TESTING.md). No usar los pendientes de esta versión anterior como estado actual.

# Validación de la versión alfa

## Resultado local del 29 de octubre de 2026

- Instalación limpia con `npm ci`: completada con Node.js 24.12.0.
- Vitest: 44 pruebas aprobadas en cuatro archivos.
- Playwright con Chromium: diez pruebas aprobadas entre escritorio y emulación móvil.
- Ruta `/Compraventa_Peru_Mexico/`: dos pruebas de catálogo y capturas aprobadas.
- Exportación JSON en Edge: recorrido de publicación perfil descarga edición y estados aprobado.
- Compilación Vite y revisión de formato: completadas.

Los logs y capturas están en `entregables/evidencias/`. Son resultados locales y no una ejecución de GitHub Actions.

## Ejecución reproducible

Desde la raíz, con Node.js 24 y npm:

```bash
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

En Windows puede usarse Edge ya instalado sin descargar Chromium:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
```

Playwright inicia `vite preview` en 127.0.0.1:4173 y prueba la salida compilada. Cada caso usa almacenamiento aislado. La suite cubre un navegador Chromium con configuración de escritorio y emulación móvil; no acredita pruebas en teléfonos físicos ni en todos los navegadores.

## Cobertura funcional

| Capa           | Casos                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Dominio        | Campos vacíos espacios límites precios catálogos modalidades imágenes búsqueda y filtros                               |
| Repositorio    | Persistencia identificadores edición propiedad estados terminales perfil datos dañados cuota conversaciones y reportes |
| Interfaz React | Publicación validación errores de guardado categorías estados vacíos mensajes Escape y foco                            |
| Navegador real | Recarga favoritos publicación edición perfil disponibilidad mensajes reportes carga de imagen y adaptación móvil       |

## Evidencias

La prueba de capturas genera `entregables/evidencias/desktop-inicio.png`, `desktop-filtros.png`, `mobile-inicio.png` y `mobile-filtros.png`. Son capturas de la compilación local. No acreditan un despliegue público ni colaboración entre personas.

El reporte navegable de Playwright queda en `frontend/playwright-report/` y las trazas de fallos en `frontend/test-results/`. Son archivos de ejecución ignorados por Git.

## Validaciones pendientes de otro entorno

- Registrar en GitHub el resultado real del workflow después de subir el cambio.
- Revisar la aplicación publicada en su URL HTTPS y anexar una captura con la dirección visible.
- Verificar cuentas API y permisos cuando exista backend; las pruebas actuales solo cubren el modo local.
