from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    KeepTogether, Flowable, Preformatted
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "entregables" / "CampusTrade_Especificacion_Tecnica_ISC_Equipo_3_MEX_PER.pdf"

GREEN = colors.HexColor("#0D6B4C")
MINT = colors.HexColor("#DDF5E9")
LIGHT = colors.HexColor("#F5F8F6")
DARK = colors.HexColor("#15231D")
GRAY = colors.HexColor("#59655F")
LINE = colors.HexColor("#D8E2DC")
ORANGE = colors.HexColor("#E5963A")


def register_fonts():
    font_dir = Path("C:/Windows/Fonts")
    regular = font_dir / "arial.ttf"
    bold = font_dir / "arialbd.ttf"
    mono = font_dir / "consola.ttf"
    if regular.exists() and bold.exists() and mono.exists():
        pdfmetrics.registerFont(TTFont("CampusSans", str(regular)))
        pdfmetrics.registerFont(TTFont("CampusSansBold", str(bold)))
        pdfmetrics.registerFont(TTFont("CampusMono", str(mono)))
        return "CampusSans", "CampusSansBold", "CampusMono"
    return "Helvetica", "Helvetica-Bold", "Courier"


REGULAR, BOLD, MONO = register_fonts()


class ArchitectureFlow(Flowable):
    def __init__(self, width=16.4*cm, height=7.8*cm):
        super().__init__()
        self.width = width
        self.height = height

    def draw_box(self, c, x, y, w, h, title, subtitle, fill):
        c.setFillColor(fill)
        c.setStrokeColor(LINE)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
        c.setFillColor(DARK)
        c.setFont(BOLD, 8)
        c.drawCentredString(x + w/2, y + h - 15, title)
        c.setFillColor(GRAY)
        c.setFont(REGULAR, 6.8)
        for index, line in enumerate(subtitle.split("\n")):
            c.drawCentredString(x + w/2, y + h - 28 - index*10, line)

    def draw(self):
        c = self.canv
        box_w, box_h = 4.8*cm, 1.45*cm
        x = 0.2*cm
        ys = [5.95*cm, 3.7*cm, 1.45*cm]
        labels = [
            ("Cliente web", "Navegador\nHTML + CSS + JavaScript", MINT),
            ("Aplicación", "React 18 + Vite\ncomponentes y estado", colors.HexColor("#EAF2ED")),
            ("Servicios futuros", "API REST + autenticación\nreglas de negocio", colors.HexColor("#FFF2E2")),
        ]
        for y, (title, subtitle, fill) in zip(ys, labels):
            self.draw_box(c, x, y, box_w, box_h, title, subtitle, fill)
        c.setStrokeColor(GREEN)
        c.setLineWidth(1.4)
        for y in [5.48*cm, 3.23*cm]:
            c.line(x+box_w/2, y, x+box_w/2, y-0.45*cm)
            c.setFillColor(GREEN)
            c.circle(x+box_w/2, y-0.45*cm, 2, fill=1, stroke=0)
        right_x = 6.3*cm
        self.draw_box(c, right_x, 5.1*cm, 4.45*cm, 1.65*cm, "Módulos de interfaz", "Catálogo · búsqueda · filtros\npublicación · perfil · mensajes", colors.HexColor("#F2F7F4"))
        self.draw_box(c, right_x, 2.55*cm, 4.45*cm, 1.65*cm, "Contratos de servicio", "Listings · usuarios · favoritos\noperaciones · conversaciones", colors.HexColor("#F2F7F4"))
        self.draw_box(c, 11.45*cm, 3.8*cm, 4.65*cm, 1.65*cm, "Persistencia futura", "Base de datos relacional\narchivos de imágenes", colors.HexColor("#F2F7F4"))
        c.setStrokeColor(GREEN)
        c.setLineWidth(1.1)
        c.line(x+box_w, 6.65*cm, right_x, 6.0*cm)
        c.line(x+box_w, 4.4*cm, right_x, 3.45*cm)
        c.line(right_x+4.45*cm, 3.37*cm, 11.45*cm, 4.45*cm)
        c.setFillColor(GRAY)
        c.setFont(REGULAR, 7)
        c.drawString(0.25*cm, 0.3*cm, "Separación propuesta: presentación → servicios → datos. El prototipo actual utiliza un repositorio simulado.")


def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle(name="CoverKicker", parent=s["Normal"], fontName=BOLD, fontSize=10,
                         leading=13, textColor=GREEN, alignment=TA_CENTER, spaceAfter=15))
    s.add(ParagraphStyle(name="CoverTitle", parent=s["Normal"], fontName=BOLD, fontSize=30,
                         leading=35, textColor=DARK, alignment=TA_CENTER, spaceAfter=10))
    s.add(ParagraphStyle(name="CoverSub", parent=s["Normal"], fontName=REGULAR, fontSize=13,
                         leading=19, textColor=GRAY, alignment=TA_CENTER, spaceAfter=24))
    s.add(ParagraphStyle(name="H1x", parent=s["Heading1"], fontName=BOLD, fontSize=20,
                         leading=24, textColor=DARK, spaceBefore=0, spaceAfter=12))
    s.add(ParagraphStyle(name="H2x", parent=s["Heading2"], fontName=BOLD, fontSize=12,
                         leading=15, textColor=GREEN, spaceBefore=12, spaceAfter=6))
    s.add(ParagraphStyle(name="Bodyx", parent=s["BodyText"], fontName=REGULAR, fontSize=9,
                         leading=13.1, textColor=DARK, spaceAfter=7))
    s.add(ParagraphStyle(name="Small", parent=s["BodyText"], fontName=REGULAR, fontSize=7.7,
                         leading=10.2, textColor=DARK, spaceAfter=3))
    s.add(ParagraphStyle(name="Cell", parent=s["BodyText"], fontName=REGULAR, fontSize=7.1,
                         leading=9.2, textColor=DARK))
    s.add(ParagraphStyle(name="CellBold", parent=s["BodyText"], fontName=BOLD, fontSize=7.1,
                         leading=9.2, textColor=DARK))
    s.add(ParagraphStyle(name="Caption", parent=s["Normal"], fontName=REGULAR, fontSize=7.4,
                         leading=10, textColor=GRAY, spaceBefore=4, spaceAfter=9))
    return s


S = styles()


def p(text, style="Bodyx"):
    return Paragraph(text, S[style])


def bullets(items):
    return [p(f"• {item}", "Bodyx") for item in items]


def table(headers, rows, widths, header_color=GREEN, font_size=None):
    head = [p(x, "CellBold") for x in headers]
    data = [head] + [[p(x, "Cell") for x in row] for row in rows]
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    ts = [
        ("BACKGROUND", (0, 0), (-1, 0), header_color),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if font_size:
        ts.append(("FONTSIZE", (0, 0), (-1, -1), font_size))
    t.setStyle(TableStyle(ts))
    return t


def note(title, text):
    t = Table([[p(f"<b>{title}</b><br/>{text}", "Small")]], colWidths=[16.2*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MINT),
        ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#A9DCC0")),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def footer(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setStrokeColor(LINE)
        canvas.line(doc.leftMargin, 1.35*cm, A4[0] - doc.rightMargin, 1.35*cm)
        canvas.setFont(REGULAR, 7.2)
        canvas.setFillColor(GRAY)
        canvas.drawString(doc.leftMargin, 0.9*cm, "CampusTrade · Especificación técnica · Equipo 3 MEX-PER · ISC")
        canvas.drawRightString(A4[0] - doc.rightMargin, 0.9*cm, f"Página {doc.page}")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, rightMargin=2.0*cm, leftMargin=2.0*cm,
        topMargin=1.65*cm, bottomMargin=1.75*cm,
        title="CampusTrade — Especificación técnica",
        author="Equipo 3 MEX-PER · ISC",
        subject="Arquitectura, componentes técnicos y APIs del prototipo CampusTrade",
    )
    story = []

    # Portada
    story += [Spacer(1, 3.0*cm), p("CAMPUS TRADE", "CoverKicker"),
              p("Especificación técnica", "CoverTitle"),
              p("Arquitectura, componentes y APIs para el prototipo web de compra, venta, renta, intercambio y donación universitaria.", "CoverSub")]
    cover = Table([
        [p("<b>Proyecto</b><br/>CampusTrade", "Bodyx"), p("<b>Equipo</b><br/>Equipo 3 MEX-PER", "Bodyx")],
        [p("<b>Área responsable</b><br/>Ingeniería en Sistemas Computacionales (ISC)", "Bodyx"), p("<b>Versión</b><br/>1.0 · Fase alfa", "Bodyx")],
    ], colWidths=[8.1*cm, 8.1*cm])
    cover.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT), ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 13), ("RIGHTPADDING", (0, 0), (-1, -1), 13),
        ("TOPPADDING", (0, 0), (-1, -1), 12), ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story += [cover, Spacer(1, 0.6*cm), note("Propósito del documento", "Define la solución técnica del equipo ISC. Distingue las capacidades implementadas en el prototipo alfa de los contratos y componentes propuestos para una implementación con servidor y base de datos."), PageBreak()]

    # 1
    story += [p("1. Alcance técnico y criterios", "H1x"),
              p("CampusTrade es una aplicación web orientada a la comunidad universitaria para publicar y localizar artículos o servicios bajo cuatro modalidades: <b>venta, renta, intercambio y donación</b>. El diseño se deriva de los requerimientos funcionales validados y del prototipo React entregado por ISC."),
              p("1.1 Estado de la solución", "H2x"),
              table(["Elemento", "Estado en fase alfa", "Decisión técnica"], [
                  ["Interfaz web", "Implementado", "React 18 renderiza el catálogo, detalle, filtros, favoritos, perfil, mensajería y formulario de publicación."],
                  ["Datos", "Simulados en memoria", "El repositorio <i>listingRepository</i> encapsula el acceso. Puede sustituirse por peticiones HTTP sin reescribir vistas."],
                  ["Autenticación", "No conectada", "Se especifica API y token para la siguiente fase; no se deben presentar datos reales ni contraseñas en el prototipo."],
                  ["Base de datos", "No incluida", "Se propone un modelo relacional y almacenamiento de imágenes separado para una fase posterior."],
                  ["Despliegue", "Local / desarrollo", "Vite sirve el proyecto; el compilado puede publicarse en un hosting estático cuando exista API disponible."],
              ], [3.1*cm, 3.0*cm, 10.1*cm]),
              p("1.2 Principios de arquitectura", "H2x")] + bullets([
                  "Separación de responsabilidades: la interfaz no conoce la fuente concreta de los datos; consume un repositorio/servicio.",
                  "API REST versionada bajo <b>/api/v1</b>, con recursos nombrados en plural y respuestas JSON.",
                  "Diseño mobile-first y componentes reutilizables para que nuevas pantallas o modalidades no requieran duplicar lógica.",
                  "Validación en cliente para experiencia inmediata y validación obligatoria en servidor para conservar integridad y seguridad.",
              ]) + [note("Límite de alcance", "Esta especificación cubre exclusivamente la parte técnica de ISC. No incorpora entregables de administración, análisis comercial ni actividades de producción ajenas al sistema."), PageBreak()]

    # 2
    story += [p("2. Arquitectura del sistema", "H1x"),
              p("La solución se organiza en tres capas lógicas. Actualmente existen las dos primeras en forma de interfaz y repositorio simulado; las capas de API y persistencia son la ruta de evolución para conectar el producto a usuarios institucionales."),
              Spacer(1, 0.15*cm), ArchitectureFlow(), p("Figura 1. Arquitectura objetivo y puntos de sustitución del prototipo.", "Caption"),
              p("2.1 Capas y responsabilidades", "H2x"),
              table(["Capa", "Responsabilidad", "Tecnologías / contratos"], [
                  ["Presentación", "Mostrar catálogo, capturar formularios, navegación, filtros y retroalimentación de acciones.", "HTML5, CSS3, React 18, JavaScript ES2022."],
                  ["Aplicación", "Gestionar estado local, transformar entradas de usuario y delegar operaciones al repositorio o API.", "Componentes React, hooks, módulos ES, Vite."],
                  ["Servicios", "Aplicar autenticación, autorización, reglas de operación, validación y auditoría.", "API REST JSON; implementación propuesta: Node.js + Express o framework equivalente."],
                  ["Datos", "Persistir usuarios, publicaciones, mensajes, operaciones, calificaciones y reportes.", "PostgreSQL o MySQL; almacenamiento de objetos para imágenes."],
              ], [2.7*cm, 7.2*cm, 6.3*cm]),
              p("La interfaz no debe conectarse directamente a la base de datos. Únicamente el servicio de aplicación tendrá credenciales de persistencia y aplicará las reglas de acceso.", "Bodyx"), PageBreak()]

    # 3
    story += [p("3. Componentes técnicos principales", "H1x"),
              p("3.1 Frontend implementado", "H2x"),
              table(["Módulo", "Responsabilidad concreta", "Entrada / salida"], [
                  ["<b>main.jsx</b>", "Punto de arranque; monta la aplicación React en el nodo raíz del documento HTML.", "Carga <i>App</i> en <i>#root</i>."],
                  ["<b>App.jsx</b>", "Coordina pantallas, navegación del prototipo, búsqueda, filtros, favoritos, detalle y flujos simulados.", "Estado de vista, consulta, filtros y colección de favoritos."],
                  ["<b>mockListings.js</b>", "Contiene publicaciones de demostración, categorías y opciones de filtro.", "Datos locales usados exclusivamente en alfa."],
                  ["<b>listingRepository.js</b>", "Define operaciones asíncronas de listado, consulta, creación y actualización sin acoplarse a la fuente de datos.", "Promesas con entidades de publicación."],
                  ["<b>styles.css</b>", "Sistema visual responsive, tarjetas, formularios, navegación y accesibilidad visual.", "Estilos globales y por componente."],
              ], [3.1*cm, 8.2*cm, 4.9*cm]),
              p("3.2 Dependencias y compilación", "H2x"),
              table(["Tecnología", "Versión / uso", "Justificación"], [
                  ["React", "18.x", "Biblioteca de interfaz basada en componentes y estado declarativo."],
                  ["React DOM", "18.x", "Renderizado de la aplicación React en navegador."],
                  ["Vite", "5.x", "Servidor de desarrollo, recarga rápida y empaquetado de la aplicación."],
                  ["HTML5 / CSS3", "Estándares web", "Estructura compatible con navegadores modernos y diseño responsive."],
                  ["JavaScript", "ES2022", "Lógica de interfaz, módulos y llamadas asíncronas futuras."],
              ], [3.2*cm, 4.0*cm, 9.0*cm]),
              p("3.3 Estructura esperada al incorporar servidor", "H2x"),
              Preformatted("frontend/                 backend/\n  src/                      src/\n    components/              routes/        # rutas HTTP\n    pages/                   controllers/   # entrada/salida JSON\n    services/                services/      # reglas de negocio\n    repositories/            repositories/  # consultas a datos\n    data/                    middleware/    # auth, validación, errores\n                             models/        # entidades y migraciones", ParagraphStyle("Code", fontName=MONO, fontSize=7.7, leading=10, textColor=DARK, backColor=LIGHT, borderColor=LINE, borderWidth=0.5, borderPadding=10)),
              PageBreak()]

    # 4
    story += [p("4. Especificación de la API REST", "H1x"),
              p("Los endpoints siguientes están <b>propuestos para la integración posterior</b>. El prototipo alfa usa el repositorio local, por lo que ninguna llamada requiere aún una conexión de red. La API recibirá y devolverá JSON UTF-8; todas las rutas se agrupan bajo <b>/api/v1</b>."),
              p("4.1 Convenciones de contrato", "H2x"),
              table(["Regla", "Especificación"], [
                  ["Autorización", "<b>Authorization: Bearer &lt;JWT&gt;</b> en rutas privadas. El JWT identifica usuario, rol y expiración."],
                  ["Fechas", "ISO 8601 en UTC, por ejemplo <i>2026-10-14T18:30:00Z</i>."],
                  ["Paginación", "Parámetros <i>page</i> y <i>limit</i>; respuesta con <i>items</i>, <i>page</i>, <i>limit</i> y <i>total</i>."],
                  ["Errores", "Objeto <i>{ error: { code, message, fields? } }</i>; no revelar trazas ni datos internos."],
              ], [3.3*cm, 12.9*cm]),
              p("4.2 Recursos y operaciones", "H2x"),
              table(["Método y ruta", "Autorización", "Uso"], [
                  ["POST /auth/register", "Pública", "Registra una cuenta con correo institucional y datos académicos."],
                  ["POST /auth/login", "Pública", "Valida credenciales y devuelve token de acceso y perfil básico."],
                  ["GET /listings", "Pública", "Lista publicaciones con query, categoría, carrera, modalidad, condición, rango de precio, estado y orden."],
                  ["POST /listings", "Usuario", "Crea una publicación; valida campos obligatorios y asigna propietario."],
                  ["GET /listings/{id}", "Pública", "Devuelve detalles, imágenes, estado y resumen público del vendedor."],
                  ["PATCH /listings/{id}", "Propietario", "Actualiza campos permitidos o disponibilidad de la publicación."],
                  ["POST /listings/{id}/favorites", "Usuario", "Marca o desmarca publicación favorita para el usuario autenticado."],
                  ["POST /conversations", "Usuario", "Crea o reutiliza una conversación entre interesado y vendedor."],
                  ["POST /operations", "Usuario", "Solicita renta, intercambio, donación o reserva de una publicación."],
                  ["POST /reports", "Usuario", "Registra reporte de fraude, spam, contenido prohibido o incumplimiento."],
              ], [5.2*cm, 3.0*cm, 8.0*cm], header_color=colors.HexColor("#176D54")),
              PageBreak()]

    # 5
    story += [p("5. Detalle de datos y ejemplos de API", "H1x"),
              p("5.1 Consulta de publicaciones", "H2x"),
              Preformatted("GET /api/v1/listings?q=calculo&career=ISC&modality=venta&condition=bueno&page=1&limit=12\n\n200 OK\n{\n  \"items\": [{\"id\": \"lst_102\", \"title\": \"Libro de Cálculo\",\n             \"price\": 180.00, \"currency\": \"MXN\", \"modality\": \"sale\",\n             \"condition\": \"good\", \"status\": \"available\", \"imageUrl\": \"...\"}],\n  \"page\": 1, \"limit\": 12, \"total\": 1\n}", ParagraphStyle("Code2", fontName=MONO, fontSize=7.4, leading=9.6, textColor=DARK, backColor=LIGHT, borderColor=LINE, borderWidth=0.5, borderPadding=9)),
              p("5.2 Creación de publicación", "H2x"),
              table(["Campo", "Tipo / regla", "Ejemplo"], [
                  ["title", "string, 8–100 caracteres", "Calculadora científica Casio"],
                  ["description", "string, 20–1,500 caracteres", "Funciona correctamente; incluye funda."],
                  ["categoryId", "UUID / id existente", "cat_electronica"],
                  ["career", "enum o catálogo", "ISC"],
                  ["condition", "new | like_new | good | fair", "good"],
                  ["modality", "sale | rental | exchange | donation", "sale"],
                  ["price", "decimal ≥ 0; obligatorio para venta/renta", "350.00"],
                  ["imageIds", "arreglo de referencias ya cargadas", "[\"img_a1\", \"img_a2\"]"],
              ], [3.0*cm, 7.1*cm, 6.1*cm]),
              p("La carga de archivos debe usar <b>POST /uploads</b> con <i>multipart/form-data</i>. El servicio valida tipo, tamaño y contenido antes de devolver una referencia segura; la creación de la publicación acepta dichas referencias y no una ruta de disco enviada por el cliente."),
              p("5.3 Códigos de respuesta", "H2x"),
              table(["Código", "Cuándo se devuelve", "Acción del cliente"], [
                  ["200 / 201", "Lectura o creación exitosa.", "Actualizar interfaz con la entidad recibida."],
                  ["400", "Formato, parámetros o regla de negocio inválidos.", "Mostrar mensaje por campo cuando aplique."],
                  ["401 / 403", "Sesión ausente/expirada o permiso insuficiente.", "Solicitar inicio de sesión o ocultar acción."],
                  ["404", "Recurso inexistente o no visible.", "Mostrar estado vacío y volver al catálogo."],
                  ["409", "Conflicto: artículo ya reservado o estado incompatible.", "Refrescar detalle y comunicar cambio."],
                  ["429 / 500", "Límite de solicitudes o fallo controlado.", "Reintentar de forma moderada y no perder el formulario."],
              ], [2.0*cm, 8.0*cm, 6.2*cm]), PageBreak()]

    # 6
    story += [p("6. Modelo de datos propuesto", "H1x"),
              p("La persistencia se plantea con una base relacional porque el sistema requiere consistencia entre publicaciones, operaciones, mensajes y calificaciones. Las imágenes deben guardarse fuera de la base de datos; la tabla conserva solamente metadatos y URL/clave de objeto."),
              p("6.1 Entidades principales", "H2x"),
              table(["Entidad", "Campos técnicos clave", "Relaciones"], [
                  ["User", "id, institutional_email, matricula_hash, career_id, password_hash, role, verified_at, created_at", "1:N Listing, Favorite, Message, Operation."],
                  ["Listing", "id, seller_id, category_id, title, description, modality, condition, price, status, published_at", "N:1 User; 1:N ListingImage, Operation, Report."],
                  ["Category", "id, name, parent_id, active", "1:N Listing; permite categorías y subcategorías."],
                  ["ListingImage", "id, listing_id, object_key, alt_text, position, mime_type", "N:1 Listing; no expone claves internas directamente."],
                  ["Favorite", "user_id, listing_id, created_at", "Clave única compuesta user_id + listing_id."],
                  ["Conversation / Message", "id, listing_id, participant ids; message.id, sender_id, body, sent_at, read_at", "Conversación asociada opcionalmente a una publicación."],
                  ["Operation", "id, listing_id, requester_id, type, status, rental_start, rental_end, offered_listing_id", "Mantiene la transición y la trazabilidad de la transacción."],
                  ["Rating / Report", "rating: score, comment; report: reason, detail, status", "Se habilitan tras operación o sobre usuario/publicación."],
              ], [3.15*cm, 8.5*cm, 4.55*cm]),
              p("6.2 Estados controlados", "H2x"),
              table(["Objeto", "Estados permitidos", "Regla"], [
                  ["Listing.status", "draft, available, reserved, sold, rented, exchanged, donated, cancelled", "Solo propietario o proceso autorizado puede modificarlo; los estados terminales no reciben nuevas solicitudes."],
                  ["Operation.status", "pending, accepted, rejected, completed, cancelled, expired", "La aceptación valida que el listing permanezca disponible; la finalización habilita calificación."],
                  ["Report.status", "open, reviewing, resolved, dismissed", "Solo perfil con rol de moderación administra el cierre."],
              ], [3.3*cm, 5.9*cm, 7.0*cm]),
              note("Integridad mínima", "Usar claves foráneas, índices en <i>Listing(status, modality, category_id, published_at)</i>, correos institucionales únicos y una transacción al aceptar una operación para evitar doble reserva."), PageBreak()]

    # 7
    story += [p("7. Seguridad, calidad y configuración", "H1x"),
              p("7.1 Controles de seguridad requeridos", "H2x"),
              table(["Riesgo", "Control técnico obligatorio"], [
                  ["Acceso no autorizado", "Contraseñas con Argon2id o bcrypt; tokens JWT de vida corta; renovación controlada; cierre de sesión en cliente."],
                  ["Suplantación", "Verificación de dominio institucional y estado <i>verified_at</i> antes de publicar, iniciar chat o solicitar operaciones."],
                  ["Manipulación de recursos", "Autorización por propietario/rol en cada endpoint; nunca confiar en userId enviado por el navegador."],
                  ["Entradas maliciosas", "Esquemas de validación en servidor, sanitización de texto mostrado y consultas parametrizadas; protección contra XSS/SQLi."],
                  ["Carga de imágenes", "Lista permitida de MIME, límite de tamaño, renombrado interno, análisis antivirus si se habilita infraestructura y URLs firmadas para acceso."],
                  ["Abuso", "Rate limit en login, registro, mensajería y reportes; registro de eventos de seguridad sin guardar secretos."],
              ], [4.3*cm, 11.9*cm]),
              p("7.2 Variables de configuración", "H2x"),
              Preformatted("# .env (no versionar ni exponer en el frontend)\nAPI_PORT=3000\nDATABASE_URL=postgresql://usuario:secreto@host:5432/campustrade\nJWT_SECRET=<secreto_largo>\nJWT_EXPIRES_IN=15m\nCORS_ORIGIN=https://campustrade.ejemplo.mx\nOBJECT_STORAGE_BUCKET=campustrade-images\nMAX_UPLOAD_MB=5", ParagraphStyle("Code3", fontName=MONO, fontSize=7.8, leading=10.2, textColor=DARK, backColor=LIGHT, borderColor=LINE, borderWidth=0.5, borderPadding=10)),
              p("En frontend, una URL pública de API se declara con el prefijo que requiera el empaquetador (por ejemplo, <b>VITE_API_BASE_URL</b>). Secretos, credenciales de base de datos y claves de firma permanecen exclusivamente en el servidor."),
              p("7.3 Requisitos de calidad técnica", "H2x"),
              table(["Aspecto", "Criterio verificable"], [
                  ["Compatibilidad", "Últimas dos versiones de Chrome, Edge, Firefox y Safari; diseño usable desde 360 px de ancho."],
                  ["Rendimiento", "Catálogo paginado; imágenes optimizadas; objetivo de carga inicial menor a 3 s en red móvil promedio."],
                  ["Accesibilidad", "Etiquetas de formulario, contraste suficiente, foco visible y navegación por teclado en acciones principales."],
                  ["Observabilidad", "Errores controlados con identificador de solicitud; métricas de latencia y registros de cambios de estado."],
              ], [3.2*cm, 13.0*cm]), PageBreak()]

    # 8
    story += [p("8. Implementación, pruebas y evolución", "H1x"),
              p("8.1 Ejecución del prototipo", "H2x"),
              table(["Paso", "Comando / resultado esperado"], [
                  ["Instalar dependencias", "<b>npm install</b> · obtiene las dependencias declaradas en package.json."],
                  ["Iniciar desarrollo", "<b>npm run dev</b> · Vite informa una URL local, normalmente http://localhost:5173/."],
                  ["Abrir aplicación", "Usar la URL de Vite indicada en la terminal; no abrir index.html directamente con <i>file://</i>, porque los módulos requieren el servidor de desarrollo."],
                  ["Compilar", "<b>npm run build</b> · genera los archivos estáticos para revisión o publicación."],
              ], [4.0*cm, 12.2*cm]),
              p("8.2 Casos técnicos de prueba para la fase alfa", "H2x"),
              table(["ID", "Caso", "Resultado esperado"], [
                  ["PT-01", "Carga inicial del catálogo", "Se renderizan publicaciones simuladas, categorías y navegación sin errores visibles."],
                  ["PT-02", "Búsqueda por palabra", "La lista muestra sólo coincidencias de título/descripción o el estado vacío correspondiente."],
                  ["PT-03", "Filtro por modalidad y condición", "Los criterios se aplican de forma acumulada y se pueden restablecer."],
                  ["PT-04", "Detalle y favoritos", "El detalle abre la entidad seleccionada y el favorito modifica sólo el estado de sesión simulado."],
                  ["PT-05", "Publicación simulada", "El formulario valida requeridos y agrega el elemento al repositorio local, sin persistir tras recarga."],
                  ["PT-06", "Diseño responsive", "Las acciones principales son accesibles en vista móvil y escritorio."],
              ], [1.4*cm, 5.2*cm, 9.6*cm]),
              p("8.3 Hoja de ruta de integración", "H2x"),
              table(["Prioridad", "Siguiente incremento técnico", "Criterio de terminación"], [
                  ["Alta", "Reemplazar repository simulado por cliente HTTP y exponer GET /listings, GET /listings/{id}, POST /listings.", "Catálogo y publicación consultan una API de prueba con datos persistentes."],
                  ["Alta", "Registro, login y verificación institucional.", "Rutas privadas protegidas; perfil autenticado; contraseñas no viajan ni se almacenan en texto plano."],
                  ["Media", "Mensajería, favoritos y operaciones con reglas de estado.", "Cada acción persiste y respeta propietario, disponibilidad y permisos."],
                  ["Media", "Moderación, calificaciones, métricas y despliegue continuo.", "Reportes administrables, bitácora de cambios y ambiente de producción configurado."],
              ], [2.0*cm, 8.2*cm, 6.0*cm]),
              note("Cierre técnico", "La arquitectura permite demostrar el flujo de CampusTrade hoy y evolucionar a una aplicación con API y base de datos sin sustituir el diseño de la interfaz. Cada componente futuro se incorpora detrás de contratos explícitos y verificables."),
    ]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()
