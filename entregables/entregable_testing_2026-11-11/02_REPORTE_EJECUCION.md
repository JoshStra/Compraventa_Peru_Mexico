# 2. Reportes de testing

Sistema CampusTrade 0.3.0, código 20759004c4448e588f6b80e89dc6c127b399198c, rama codex/minimal-buscador-2026-11-11. Ejecución del 11 de noviembre de 2026, zona America/Mexico_City (UTC-06:00).

| Grupo | Casos | Inicio UTC | Fin UTC | Salida |
| --- | --- | --- | --- | --- |
| Frontend | 55 | 2026-11-11T16:04:29.786Z | 2026-11-11T16:04:41.818Z | 0 |
| API y configuración | 50 | 2026-11-11T16:04:43.588Z | 2026-11-11T16:04:58.110Z | 0 |
| Navegador | 26 | 2026-11-11T16:05:59.937Z | 2026-11-11T16:06:38.365Z | 0 |

Frontend: Vitest y JSDOM sobre siete archivos. Incluye componentes y dominio aislados; App, campusRepository y parte del catálogo corresponden al prototipo explícito de almacenamiento local, no prueban por sí solos la API conectada.

API: Node.js 24 y PostgreSQL 17 local de desarrollo. Los flujos usan esquemas temporales aislados; los tres casos de infraestructura consultan directamente la base local de desarrollo. Los cuatro casos de configuración no requieren base de datos. Incluye autenticación, persistencia, concurrencia, operaciones, moderación y dieciséis casos de seguridad. El transporte de correo se sustituye por un buzón de pruebas en memoria.

Navegador: Chrome instalado, proyectos desktop y mobile (Pixel 7 emulado), dos workers y servidor de pruebas en 127.0.0.1:4180. Los casos específicos fuerzan 320 px. Se usan cuentas y publicaciones sintéticas, sin modificar el catálogo migrado de Docker.

Evidencias primarias: evidencias/frontend.json, api.xml y navegador.json, junto con sus logs y metadatos *-ejecucion.json. Se ocultó únicamente la clave temporal E2E y se normalizó la ruta local del repositorio; redacciones.json documenta la omisión. Los resultados y duraciones permanecen íntegros.
