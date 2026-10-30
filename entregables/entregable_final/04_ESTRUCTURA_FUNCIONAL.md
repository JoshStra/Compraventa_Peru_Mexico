# Arquitectura implementada

React 18/Vite presenta la aplicación HTTP. Node/Express sirve frontend/dist y /api/v1 desde un mismo origen. PostgreSQL 17 conserva datos compartidos. Las imágenes se almacenan fuera de PostgreSQL: archivos locales en desarrollo y Supabase S3 privado probado para producción. El modo anterior de demostración solo se selecciona explícitamente con VITE_DEMO_MODE=true.

```mermaid
flowchart LR
  U[Estudiante o administrador] --> R[React: ConnectedApp y formularios]
  R -->|HTTPS JSON, cookie y CSRF| E[Express /api/v1]
  E --> A[Sesión, permisos, validación Zod]
  A --> S[Servicios de negocio]
  S -->|SQL parametrizado y transacciones| P[(PostgreSQL)]
  S --> O[Almacenamiento local / adaptador S3]
  S --> M[Adaptador de correo Resend o SMTP]
```

El sistema está desplegado en Render Free, con PostgreSQL Neon Free y Supabase S3 privado. Se comprobaron HTTPS, conexión TLS, migraciones y persistencia tras redeploy. La prueba de S3 usa el adaptador del backend desde un cliente autorizado; los recorridos productivos con alumnos verificados siguen pendientes de correo. Los endpoints administrativos validan el rol en el servidor. El frontend no decide identidad ni propiedad.

```text
frontend/
  src/connected/       ConnectedApp, Forms, Messenger, Operations, Admin
  src/services/        apiClient: HTTP y CSRF, sin credencial en localStorage
  src/components/      catálogo, modales, iconos y visuales compartidos
  src/AppShell.jsx     demostración anterior explícita
  e2e/                 recorridos HTTP/PostgreSQL en escritorio y móvil
backend/
  migrations/          001_initial.sql, 002_operation_amounts.sql
  src/routes/          auth, listings, conversations, operations, moderation
  src/controllers/     controladores HTTP de publicaciones
  src/services/        negocio, correo y objetos
  src/repositories/    conexiones, usuarios y publicaciones
  src/validators/      esquemas Zod y reglas de contenido
  src/middleware/      sesiones, permisos y errores
  src/models/          ejecutor de migraciones con checksum
  src/scripts/         promoción controlada de administrador
  test/                API real, concurrencia y reinicio de procesos
.github/workflows/     validación Linux con PostgreSQL y navegador
docs/                 documentación técnica vigente
entregables/entregable_final/  siete apartados y evidencias
```

## Flujos

Registro → hash Argon2id y matrícula HMAC → enlace de un uso → sesión revocable. Publicar → validar campos e imágenes → asociar referencias propias → guardar transacción. Mensajes → comprobar participación → insertar emisor de sesión → consultar historial. Solicitar → bloquear publicaciones en orden → aceptar/reservar → finalizar estado terminal → calificar. En renta, devolución explícita vuelve a disponibilidad. En intercambio, ambas publicaciones se reservan y finalizan juntas. Moderación conserva decisiones e historial.

## Decisiones y límites

Se sustituyó el JWT propuesto por sesiones opacas revocables para invalidación inmediata. Se eligió servir el cliente junto a la API para mantener cookies del mismo origen. No hay pasarela de pago, validación documental de matrícula ni GPS; la pertenencia se comprueba mediante control del correo institucional. Mensajes, operaciones y panel administrativo muestran hasta cien registros recientes; los mensajes individuales y el catálogo sí tienen paginación. El perfil carga hasta cincuenta publicaciones recientes. La administración completa de registros antiguos requiere ampliar esos listados antes de escalar el servicio.

El modelo SQL real se documenta en [DATABASE.md](../../docs/DATABASE.md); las rutas en [API.md](../../docs/API.md). No existen microservicios ni capas de almacenamiento remoto desplegadas en esta ejecución.

## Modelo entidad-relación

```mermaid
erDiagram
  USERS ||--o{ SESSIONS : inicia
  USERS ||--o{ ACCESS_TOKENS : verifica_recupera
  CAREERS ||--o{ USERS : pertenece
  USERS ||--o{ LISTINGS : publica
  CATEGORIES ||--o{ LISTINGS : clasifica
  LISTINGS ||--o{ LISTING_IMAGES : referencia
  USERS ||--o{ FAVORITES : guarda
  LISTINGS ||--o{ FAVORITES : favorito
  LISTINGS ||--o{ CONVERSATIONS : origina
  USERS ||--o{ CONVERSATIONS : participa
  CONVERSATIONS ||--o{ MESSAGES : contiene
  LISTINGS ||--o{ OPERATIONS : solicita
  USERS ||--o{ OPERATIONS : interesado
  OPERATIONS ||--o{ RATINGS : permite
  USERS ||--o{ RATINGS : autor_destinatario
  LISTINGS ||--o{ REPORTS : recibe
  USERS ||--o{ REPORTS : reporta
  USERS ||--o{ AUDIT_EVENTS : administra
```

Diagrama basado en las migraciones aplicadas, no en una propuesta futura. Captura auténtica de carpetas publicadas: [repositorio main](evidencias/05-repositorio-main.jpg).

![Arquitectura derivada del código implementado](evidencias/04-arquitectura-implementada.png)
