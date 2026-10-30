# Release y despliegue

Versión candidata: **v0.3.0-rc.1**, base de paquetes 0.3.0. El salto menor refleja el primer cliente HTTP completo con API/PostgreSQL; rc.1 expresa que faltan activaciones externas y revisión independiente. No es una versión productiva certificada.

La publicación del tag y GitHub Release debe acreditarse con el enlace real registrado en [estado de entrega](README.md), después de la validación final. CHANGELOG resume los cambios reales. El tag apunta al código/documentación integrado; las evidencias posteriores no alteran ese tag.

Incluye cuentas, publicaciones, imágenes locales validadas, favoritos, mensajes, reservas de venta/renta/intercambio/donación, calificaciones, reportes y administración. Se corrigieron los issues #1 y #2. Validación: 47 pruebas frontend, 30 API/PostgreSQL y 10 recorridos E2E; consultar logs finales y CI. No hay transporte real de correo ni validación externa S3.

**Despliegue público: PENDIENTE.** No existe URL de frontend ni backend públicos verificados, fecha de despliegue o captura de un sistema remoto. Las imágenes `desktop-*` y `mobile-*` son del servidor local de pruebas con datos sintéticos; no se presentan como despliegue. Un release de fuentes no cumple por sí solo este criterio.

Procedimiento completo, alternativas gratuitas, variables, migraciones, health, actualización y recuperación: [DEPLOYMENT.md](../../docs/DEPLOYMENT.md). Configuración preparada: [render.yaml](../../render.yaml). La intervención pendiente consiste en conectar cuentas Free de Render/Neon y almacenamiento compatible S3; el correo seguirá pendiente hasta que el responsable elija proveedor. No se contrató ningún servicio de pago.
