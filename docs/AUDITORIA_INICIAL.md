# Auditoría inicial de CampusTrade

Fecha de revisión: 30 de octubre de 2026. Repositorio oficial: https://github.com/JoshStra/Compraventa_Peru_Mexico. Autor de esta ejecución: cuenta Git configurada `mora8292`; no se atribuyen estas modificaciones a otros integrantes.

## Línea base y sincronización

El remoto main estaba en `019a4ee`, con tres commits históricos. La mejora alfa de la sesión anterior estaba publicada en `codex/alfa-persistente-evidencias`, commit `3427ed5`, y aún no integrada en main. Se conservaron ambos historiales y se incorporó esa mejora a main mediante avance rápido. No se creó un commit vacío ni se alteró ninguna fecha.

La rama main original tiene frontend React 18 y Vite 5, pero su comando build invoca esbuild sin declararlo directamente. Se reprodujo el fallo «esbuild no se reconoce como un comando» en el entorno disponible. La versión `3427ed5` sustituye esa compilación por Vite 8.3.5 y conserva React 18.3.1; no se reinstalarán versiones antiguas solo porque los documentos las mencionan.

## Documentos contrastados

Se leyeron los cuatro PDF proporcionados: especificación técnica de nueve páginas; fase 2 de quince páginas; entregable de repositorio de cinco páginas; validación técnica de dos páginas. Se inspeccionaron también las capturas y diagramas del entregable de repositorio y la validación de estados.

La fase 2 identifica a Alexis Martin Cortés De Lucio y Brandon Joshua Labastida Jiménez como integrantes de ISC. Los documentos acreditan antecedentes y propuestas; no prueban que ya exista un backend funcionando. La captura histórica del issue #1 lo muestra abierto, sin comentario de resolución. Los diagramas de API, PostgreSQL y almacenamiento describen la arquitectura objetivo.

## Funcionalidades encontradas

IMPLEMENTADO Y VERIFICADO en la alfa local: catálogo, búsqueda, filtros, detalle, publicaciones locales con imagen opcional, edición, disponibilidad, favoritos, perfil, mensajes y reportes locales; validaciones, modales accesibles y exportación JSON. Los datos se guardan en localStorage. Las pruebas actuales incluyen 44 casos de lógica e interfaz y recorridos Playwright del compilado.

PENDIENTE al iniciar esta entrega: API, PostgreSQL, cuentas reales, sesiones, verificación institucional, autorización de servidor, intercambio de mensajes entre usuarios, operaciones transaccionales, calificaciones y moderación compartida. Ninguno se acreditará como implementado por existir un diseño o una pantalla.

## Diferencias y riesgos

- El límite actual de imagen es 500 KB y almacenamiento en el navegador; la revisión técnica exige hasta 5 MB y archivos externos a las tablas relacionales.
- La propiedad de artículos se verifica solo en código local, modificable por el usuario. No constituye autorización de servidor.
- El catálogo inicial y sus perfiles son ejemplos. No pueden usarse como cuentas verificadas reales ni como prueba de mensajería multiusuario.
- Las operaciones concurrentes y los estados terminales necesitan bloqueos y restricciones de PostgreSQL; no basta actualizar estado React.
- El repositorio no presenta releases, PR revisados ni ejecuciones de Actions al inicio. No tiene una URL pública configurada ni Pages activado.
- El issue #1 está abierto y tiene cero comentarios; la reorganización ya existe en frontend, pero se debe validar e integrar antes de documentar su cierre.

## Recursos y permisos

Docker está disponible y su servidor informa versión 29.5.3. Se utilizará PostgreSQL real para integración, migraciones, concurrencia y persistencia; no una simulación SQL. El usuario confirmó `itesa.edu.mx` como dominio institucional autorizado.

La cuenta conectada tiene acceso de escritura y triage en GitHub, sin administración del repositorio. SMTP o un proveedor de correo, credenciales de almacenamiento y servicios de alojamiento deben comprobarse por separado. La falta de una credencial bloqueará únicamente la activación correspondiente.

## Plan de incrementos

1. Auditar y estabilizar la línea base, conservar el historial e integrar la alfa existente.
2. Crear esquema relacional, migraciones, conexión y API base comprobados con PostgreSQL.
3. Implementar cuentas, sesiones, permisos, verificación y recuperación de acceso con transporte de correo configurable.
4. Implementar publicaciones e imágenes, favoritos y mensajería persistentes.
5. Implementar operaciones seguras frente a concurrencia, calificaciones y moderación.
6. Conectar las pantallas React a los contratos HTTP y verificar recorridos completos y responsive.
7. Preparar y ejecutar el despliegue gratuito que permitan los accesos, publicar versión candidata y elaborar los siete apartados con evidencia real.

Cada incremento tendrá pruebas pertinentes, revisión de diff, commit descriptivo y publicación segura en main. Las fechas serán las generadas realmente por Git. No se inventarán revisiones, aprobaciones ni porcentajes de avance.
