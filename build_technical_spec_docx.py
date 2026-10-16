from pathlib import Path
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "entregables" / "CampusTrade_Especificacion_Tecnica_ISC_Equipo_3_MEX_PER.docx"
BLACK = RGBColor(0, 0, 0)
GRAY = "D9D9D9"
PALE = "F4F6F5"
DARK = "3F4A45"


def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_border(cell, color=GRAY):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge in ("top", "left", "bottom", "right"):
        tag = qn(f"w:{edge}")
        element = borders.find(tag)
        if element is None:
            element = OxmlElement(f"w:{edge}")
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), "6")
        element.set(qn("w:color"), color)


def set_font(run, name="Aptos", size=10.5, bold=False, color=BLACK):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color


def set_cell_text(cell, text, bold=False, color=BLACK, size=8.8, align=WD_ALIGN_PARAGRAPH.LEFT):
    cell.text = ""
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    paragraph = cell.paragraphs[0]
    paragraph.alignment = align
    paragraph.paragraph_format.space_after = Pt(0)
    paragraph.paragraph_format.space_before = Pt(0)
    paragraph.paragraph_format.line_spacing = 1.05
    run = paragraph.add_run(text)
    set_font(run, size=size, bold=bold, color=color)


def add_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for index, header in enumerate(headers):
        cell = table.rows[0].cells[index]
        cell.width = Inches(widths[index])
        shade(cell, DARK)
        set_cell_border(cell)
        set_cell_text(cell, header, bold=True, color=RGBColor(255, 255, 255), size=8.7)
    for row_index, row in enumerate(rows):
        cells = table.add_row().cells
        for index, value in enumerate(row):
            cells[index].width = Inches(widths[index])
            if row_index % 2 == 1:
                shade(cells[index], PALE)
            set_cell_border(cells[index])
            set_cell_text(cells[index], value, size=8.55)
    for row in table.rows:
        row._tr.get_or_add_trPr().append(OxmlElement("w:cantSplit"))
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def add_heading(doc, text, level=1):
    paragraph = doc.add_paragraph(style=f"Heading {level}")
    paragraph.paragraph_format.keep_with_next = True
    run = paragraph.add_run(text)
    set_font(run, size=16 if level == 1 else 12.5, bold=True)
    return paragraph


def add_body(doc, text, bold_lead=None):
    paragraph = doc.add_paragraph(style="Normal")
    paragraph.paragraph_format.space_after = Pt(7)
    paragraph.paragraph_format.line_spacing = 1.13
    if bold_lead and text.startswith(bold_lead):
        first = paragraph.add_run(bold_lead)
        set_font(first, size=10.5, bold=True)
        rest = paragraph.add_run(text[len(bold_lead):])
        set_font(rest, size=10.5)
    else:
        run = paragraph.add_run(text)
        set_font(run, size=10.5)
    return paragraph


def add_bullets(doc, items):
    for item in items:
        paragraph = doc.add_paragraph(style="List Bullet")
        paragraph.paragraph_format.space_after = Pt(3)
        paragraph.paragraph_format.line_spacing = 1.08
        run = paragraph.add_run(item)
        set_font(run, size=10.2)


def add_code(doc, text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    shade(cell, "F2F2F2")
    set_cell_border(cell)
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    run = p.add_run(text)
    set_font(run, name="Consolas", size=8.2)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


def configure_styles(doc):
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Aptos"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = BLACK
    for name in ("Title", "Heading 1", "Heading 2"):
        style = styles[name]
        style.font.name = "Aptos Display" if name == "Title" else "Aptos"
        style._element.rPr.rFonts.set(qn("w:ascii"), style.font.name)
        style._element.rPr.rFonts.set(qn("w:hAnsi"), style.font.name)
        style.font.color.rgb = BLACK


def add_cover(doc):
    doc.add_paragraph().paragraph_format.space_after = Pt(82)
    title = doc.add_paragraph(style="Title")
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_after = Pt(14)
    set_font(title.add_run("Especificacion tecnica CampusTrade"), name="Aptos Display", size=25, bold=True)
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle.paragraph_format.space_after = Pt(42)
    set_font(subtitle.add_run("Arquitectura componentes y APIs del prototipo web"), size=13)
    table = doc.add_table(rows=2, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    values = [
        ("Proyecto", "CampusTrade"), ("Equipo", "Equipo 3 MEX-PER"),
        ("Area responsable", "Ingenieria en Sistemas Computacionales ISC"), ("Version", "1.0 Fase alfa"),
    ]
    for index, (label, value) in enumerate(values):
        cell = table.cell(index // 2, index % 2)
        cell.width = Inches(3.25)
        shade(cell, PALE)
        set_cell_border(cell)
        cell.text = ""
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        a = p.add_run(label + "\n")
        set_font(a, size=9, bold=True)
        b = p.add_run(value)
        set_font(b, size=10.5)
    doc.add_paragraph().paragraph_format.space_after = Pt(14)
    add_body(doc, "Este documento define la solucion tecnica de CampusTrade para el equipo ISC. Describe lo ya implementado en el prototipo y los componentes, contratos y configuraciones requeridos para evolucionar a una aplicacion con API y base de datos.")
    doc.add_page_break()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.72)
    section.bottom_margin = Inches(0.72)
    section.left_margin = Inches(0.78)
    section.right_margin = Inches(0.78)
    configure_styles(doc)
    add_cover(doc)

    add_heading(doc, "1 Alcance tecnico y criterios")
    add_body(doc, "CampusTrade es una aplicacion web para que la comunidad universitaria publique y localice articulos o servicios mediante venta, renta, intercambio y donacion. La especificacion se fundamenta en los requerimientos validados y en el prototipo React desarrollado por ISC.")
    add_heading(doc, "1 1 Estado de la solucion", 2)
    add_table(doc, ["Elemento", "Estado en fase alfa", "Decision tecnica"], [
        ["Interfaz web", "Implementado", "React 18 renderiza catalogo, detalle, filtros, favoritos, perfil, mensajeria y formulario de publicacion."],
        ["Datos", "Simulados en memoria", "listingRepository encapsula el acceso; puede sustituirse por peticiones HTTP sin reescribir las vistas."],
        ["Autenticacion", "No conectada", "Se define contrato de API y token para la siguiente fase; el prototipo no usa datos ni contrasenas reales."],
        ["Base de datos", "No incluida", "Se propone modelo relacional y almacenamiento de imagenes separado para una fase posterior."],
        ["Despliegue", "Local y desarrollo", "Vite sirve el proyecto; el compilado puede publicarse cuando exista una API disponible."],
    ], [1.3, 1.45, 4.0])
    add_heading(doc, "1 2 Principios de arquitectura", 2)
    add_bullets(doc, [
        "La interfaz no conoce la fuente concreta de datos; consume un repositorio o servicio intercambiable.",
        "La API propuesta usa REST versionado bajo /api/v1, recursos en plural y respuestas JSON.",
        "El diseno mobile first y los componentes reutilizables permiten incorporar pantallas o modalidades sin duplicar logica.",
        "La validacion en cliente mejora la experiencia, pero la validacion de servidor conserva integridad y seguridad.",
    ])
    doc.add_page_break()

    add_heading(doc, "2 Arquitectura del sistema")
    add_body(doc, "La solucion se organiza en tres capas logicas. En fase alfa existe la interfaz React y un repositorio simulado. La API y la persistencia se agregaran como capas independientes para conectar el sistema a usuarios institucionales.")
    add_heading(doc, "2 1 Capas y responsabilidades", 2)
    add_table(doc, ["Capa", "Responsabilidad", "Tecnologias y contratos"], [
        ["Presentacion", "Muestra catalogo, captura formularios, navegacion, filtros y retroalimentacion de acciones.", "HTML5, CSS3, React 18, JavaScript ES2022."],
        ["Aplicacion", "Gestiona estado local, transforma entradas y delega operaciones al repositorio o API.", "Componentes React, hooks, modulos ES y Vite."],
        ["Servicios", "Aplica autenticacion, autorizacion, reglas de operacion, validacion y auditoria.", "API REST JSON; propuesta Node.js y Express o equivalente."],
        ["Datos", "Persiste usuarios, publicaciones, mensajes, operaciones, calificaciones y reportes.", "PostgreSQL o MySQL; almacenamiento de objetos para imagenes."],
    ], [1.25, 3.25, 2.25])
    add_heading(doc, "2 2 Flujo tecnico", 2)
    add_table(doc, ["Origen", "Intercambio", "Destino"], [
        ["Cliente web", "Solicitudes de interfaz y eventos", "Aplicacion React"],
        ["Aplicacion React", "Funciones asincronas del repositorio", "Repositorio simulado en alfa o cliente HTTP futuro"],
        ["API REST futura", "JSON con validacion y autorizacion", "Servicio de negocio"],
        ["Servicio de negocio", "Consultas transaccionales y archivos", "Base de datos y almacenamiento de imagenes"],
    ], [1.7, 3.25, 1.8])
    add_body(doc, "La interfaz no debe conectarse directamente a la base de datos. Solo el servicio de aplicacion tendra credenciales de persistencia y aplicara reglas de acceso.")
    doc.add_page_break()

    add_heading(doc, "3 Componentes tecnicos principales")
    add_heading(doc, "3 1 Frontend implementado", 2)
    add_table(doc, ["Modulo", "Responsabilidad concreta", "Entrada y salida"], [
        ["main.jsx", "Punto de arranque que monta la aplicacion React en el nodo raiz del documento HTML.", "Carga App en #root."],
        ["App.jsx", "Coordina pantallas, navegacion, busqueda, filtros, favoritos, detalle y flujos simulados.", "Estado de vista, consulta, filtros y favoritos."],
        ["mockListings.js", "Contiene publicaciones de demostracion, categorias y opciones de filtro.", "Datos locales de fase alfa."],
        ["listingRepository.js", "Define operaciones asincronas de listado, consulta, creacion y actualizacion sin acoplarse a la fuente de datos.", "Promesas con entidades de publicacion."],
        ["styles.css", "Define interfaz responsive, tarjetas, formularios, navegacion y accesibilidad visual.", "Estilos globales y por componente."],
    ], [1.45, 3.65, 1.65])
    add_heading(doc, "3 2 Dependencias y compilacion", 2)
    add_table(doc, ["Tecnologia", "Version y uso", "Justificacion"], [
        ["React", "18.x", "Biblioteca de interfaz basada en componentes y estado declarativo."],
        ["React DOM", "18.x", "Renderizado de la aplicacion React en el navegador."],
        ["Vite", "5.x", "Servidor de desarrollo, recarga rapida y empaquetado."],
        ["HTML5 y CSS3", "Estandares web", "Estructura compatible y diseno responsive."],
        ["JavaScript", "ES2022", "Logica de interfaz, modulos y llamadas asincronas futuras."],
    ], [1.55, 1.45, 3.75])
    add_heading(doc, "3 3 Estructura al incorporar servidor", 2)
    add_code(doc, "frontend/                 backend/\n  src/                      src/\n    components/              routes/        rutas HTTP\n    pages/                   controllers/   entrada y salida JSON\n    services/                services/      reglas de negocio\n    repositories/            repositories/  consultas a datos\n    data/                    middleware/    autenticacion validacion errores\n                             models/        entidades y migraciones")
    doc.add_page_break()

    add_heading(doc, "4 Especificacion de la API REST")
    add_body(doc, "Los endpoints de esta seccion estan propuestos para la integracion posterior. El prototipo alfa usa el repositorio local y no requiere conexion de red. La API recibira y devolvera JSON UTF 8; las rutas se agrupan bajo /api/v1.")
    add_heading(doc, "4 1 Convenciones de contrato", 2)
    add_table(doc, ["Regla", "Especificacion"], [
        ["Autorizacion", "Authorization Bearer <JWT> en rutas privadas. El token identifica usuario, rol y expiracion."],
        ["Fechas", "ISO 8601 en UTC, por ejemplo 2026-10-14T18:30:00Z."],
        ["Paginacion", "Parametros page y limit; respuesta con items, page, limit y total."],
        ["Errores", "Objeto error con code, message y fields opcionales. Nunca revelar trazas o datos internos."],
    ], [1.5, 5.25])
    add_heading(doc, "4 2 Recursos y operaciones", 2)
    add_table(doc, ["Metodo y ruta", "Acceso", "Uso"], [
        ["POST /auth/register", "Publica", "Registra cuenta con correo institucional y datos academicos."],
        ["POST /auth/login", "Publica", "Valida credenciales y devuelve token de acceso y perfil basico."],
        ["GET /listings", "Publica", "Lista publicaciones con consulta, categoria, carrera, modalidad, condicion, precio y estado."],
        ["POST /listings", "Usuario", "Crea una publicacion y asigna propietario autenticado."],
        ["GET /listings/{id}", "Publica", "Devuelve detalle, imagenes, estado y resumen publico del vendedor."],
        ["PATCH /listings/{id}", "Propietario", "Actualiza campos permitidos o disponibilidad."],
        ["POST /listings/{id}/favorites", "Usuario", "Marca o desmarca favoritos del usuario autenticado."],
        ["POST /conversations", "Usuario", "Crea o reutiliza conversacion entre interesado y vendedor."],
        ["POST /operations", "Usuario", "Solicita renta, intercambio, donacion o reserva."],
        ["POST /reports", "Usuario", "Registra reporte de fraude, spam o contenido prohibido."],
    ], [2.25, 1.1, 3.4])
    doc.add_page_break()

    add_heading(doc, "5 Datos y ejemplos de API")
    add_heading(doc, "5 1 Consulta de publicaciones", 2)
    add_code(doc, "GET /api/v1/listings?q=calculo&career=ISC&modality=venta&condition=bueno&page=1&limit=12\n\n200 OK\n{\n  \"items\": [{\"id\": \"lst_102\", \"title\": \"Libro de Calculo\",\n             \"price\": 180.00, \"currency\": \"MXN\", \"modality\": \"sale\",\n             \"condition\": \"good\", \"status\": \"available\", \"imageUrl\": \"...\"}],\n  \"page\": 1, \"limit\": 12, \"total\": 1\n}")
    add_heading(doc, "5 2 Creacion de publicacion", 2)
    add_table(doc, ["Campo", "Tipo y regla", "Ejemplo"], [
        ["title", "string de 8 a 100 caracteres", "Calculadora cientifica Casio"],
        ["description", "string de 20 a 1500 caracteres", "Funciona correctamente e incluye funda."],
        ["categoryId", "UUID o identificador existente", "cat_electronica"],
        ["career", "enum o catalogo", "ISC"],
        ["condition", "new, like_new, good o fair", "good"],
        ["modality", "sale, rental, exchange o donation", "sale"],
        ["price", "decimal mayor o igual a cero; obligatorio en venta y renta", "350.00"],
        ["imageIds", "arreglo de referencias ya cargadas", "img_a1, img_a2"],
    ], [1.25, 3.7, 1.8])
    add_body(doc, "La carga de archivos debe usar POST /uploads con multipart form data. El servicio valida tipo, tamano y contenido antes de devolver una referencia segura. La publicacion acepta referencias de imagen, no rutas de disco enviadas por el cliente.")
    add_heading(doc, "5 3 Codigos de respuesta", 2)
    add_table(doc, ["Codigo", "Cuando se devuelve", "Accion del cliente"], [
        ["200 y 201", "Lectura o creacion exitosa.", "Actualizar interfaz con la entidad recibida."],
        ["400", "Formato, parametros o regla de negocio invalida.", "Mostrar mensaje por campo cuando aplique."],
        ["401 y 403", "Sesion ausente, expirada o permiso insuficiente.", "Solicitar inicio de sesion u ocultar accion."],
        ["404", "Recurso inexistente o no visible.", "Mostrar estado vacio y volver al catalogo."],
        ["409", "Articulo reservado o estado incompatible.", "Refrescar detalle y comunicar cambio."],
        ["429 y 500", "Limite de solicitudes o fallo controlado.", "Reintentar con moderacion sin perder formulario."],
    ], [1.0, 3.25, 2.5])
    doc.add_page_break()

    add_heading(doc, "6 Modelo de datos propuesto")
    add_body(doc, "Se propone una base relacional porque el sistema requiere consistencia entre publicaciones, operaciones, mensajes y calificaciones. Las imagenes se almacenan fuera de la base de datos; las tablas conservan metadatos y URL o clave de objeto.")
    add_heading(doc, "6 1 Entidades principales", 2)
    add_table(doc, ["Entidad", "Campos tecnicos clave", "Relaciones"], [
        ["User", "id, institutional_email, matricula_hash, career_id, password_hash, role, verified_at, created_at", "1:N Listing, Favorite, Message y Operation."],
        ["Listing", "id, seller_id, category_id, title, description, modality, condition, price, status, published_at", "N:1 User; 1:N ListingImage, Operation y Report."],
        ["Category", "id, name, parent_id, active", "1:N Listing; admite categorias y subcategorias."],
        ["ListingImage", "id, listing_id, object_key, alt_text, position, mime_type", "N:1 Listing; no expone claves internas."],
        ["Favorite", "user_id, listing_id, created_at", "Clave unica compuesta por usuario y publicacion."],
        ["Conversation y Message", "id, listing_id, participantes; sender_id, body, sent_at, read_at", "Conversacion asociada opcionalmente a una publicacion."],
        ["Operation", "id, listing_id, requester_id, type, status, rental_start, rental_end, offered_listing_id", "Conserva transicion y trazabilidad de la operacion."],
        ["Rating y Report", "rating score y comment; report reason, detail y status", "Se habilitan tras operacion o sobre usuario y publicacion."],
    ], [1.35, 3.7, 1.7])
    add_heading(doc, "6 2 Estados controlados", 2)
    add_table(doc, ["Objeto", "Estados permitidos", "Regla"], [
        ["Listing.status", "draft, available, reserved, sold, rented, exchanged, donated, cancelled", "Solo propietario o proceso autorizado modifica; estados terminales no reciben solicitudes."],
        ["Operation.status", "pending, accepted, rejected, completed, cancelled, expired", "La aceptacion valida disponibilidad y la finalizacion habilita calificacion."],
        ["Report.status", "open, reviewing, resolved, dismissed", "Solo rol de moderacion administra el cierre."],
    ], [1.4, 2.5, 2.85])
    add_body(doc, "Integridad minima: usar claves foraneas, indices en Listing por status, modality, category_id y published_at, correos institucionales unicos y una transaccion al aceptar una operacion para evitar doble reserva.")
    doc.add_page_break()

    add_heading(doc, "7 Seguridad calidad y configuracion")
    add_heading(doc, "7 1 Controles de seguridad requeridos", 2)
    add_table(doc, ["Riesgo", "Control tecnico obligatorio"], [
        ["Acceso no autorizado", "Contrasenas con Argon2id o bcrypt; JWT de vida corta; renovacion controlada y cierre de sesion."],
        ["Suplantacion", "Verificacion de dominio institucional y estado verified_at antes de publicar, iniciar chat o solicitar operaciones."],
        ["Manipulacion de recursos", "Autorizacion por propietario o rol en cada endpoint; no confiar en userId enviado por navegador."],
        ["Entradas maliciosas", "Esquemas de validacion, sanitizacion de texto mostrado y consultas parametrizadas contra XSS y SQLi."],
        ["Carga de imagenes", "Lista de MIME permitidos, limite de tamano, renombrado interno y URLs firmadas para acceso."],
        ["Abuso", "Rate limit en login, registro, mensajeria y reportes; bitacora de eventos sin secretos."],
    ], [1.85, 4.85])
    add_heading(doc, "7 2 Variables de configuracion", 2)
    add_code(doc, "# .env no versionar ni exponer en el frontend\nAPI_PORT=3000\nDATABASE_URL=postgresql://usuario:secreto@host:5432/campustrade\nJWT_SECRET=<secreto_largo>\nJWT_EXPIRES_IN=15m\nCORS_ORIGIN=https://campustrade.ejemplo.mx\nOBJECT_STORAGE_BUCKET=campustrade-images\nMAX_UPLOAD_MB=5")
    add_body(doc, "En frontend una URL publica de API se declara con el prefijo que requiera el empaquetador, por ejemplo VITE_API_BASE_URL. Secretos, credenciales de base de datos y claves de firma permanecen exclusivamente en servidor.")
    add_heading(doc, "7 3 Requisitos de calidad tecnica", 2)
    add_table(doc, ["Aspecto", "Criterio verificable"], [
        ["Compatibilidad", "Ultimas dos versiones de Chrome, Edge, Firefox y Safari; diseno usable desde 360 px de ancho."],
        ["Rendimiento", "Catalogo paginado, imagenes optimizadas y objetivo de carga inicial menor a tres segundos en red movil promedio."],
        ["Accesibilidad", "Etiquetas de formulario, contraste suficiente, foco visible y navegacion por teclado."],
        ["Observabilidad", "Errores controlados con identificador de solicitud; metricas de latencia y registros de cambios de estado."],
    ], [1.45, 5.25])
    doc.add_page_break()

    add_heading(doc, "8 Implementacion pruebas y evolucion")
    add_heading(doc, "8 1 Ejecucion del prototipo", 2)
    add_table(doc, ["Paso", "Comando o resultado esperado"], [
        ["Instalar dependencias", "npm install obtiene las dependencias declaradas en package.json."],
        ["Iniciar desarrollo", "npm run dev inicia Vite e informa una URL local, normalmente http://localhost:5173/."],
        ["Abrir aplicacion", "Usar la URL indicada por Vite y no abrir index.html directamente con file, porque los modulos requieren servidor de desarrollo."],
        ["Compilar", "npm run build genera los archivos estaticos para revision o publicacion."],
    ], [1.7, 5.0])
    add_heading(doc, "8 2 Casos tecnicos de prueba para fase alfa", 2)
    add_table(doc, ["ID", "Caso", "Resultado esperado"], [
        ["PT-01", "Carga inicial del catalogo", "Renderiza publicaciones simuladas, categorias y navegacion sin errores visibles."],
        ["PT-02", "Busqueda por palabra", "Muestra coincidencias de titulo o descripcion, o estado vacio correspondiente."],
        ["PT-03", "Filtro por modalidad y condicion", "Aplica criterios acumulados y permite restablecerlos."],
        ["PT-04", "Detalle y favoritos", "Abre entidad seleccionada y modifica solo estado de sesion simulado."],
        ["PT-05", "Publicacion simulada", "Valida requeridos y agrega al repositorio local sin persistir tras recarga."],
        ["PT-06", "Diseno responsive", "Acciones principales accesibles en vista movil y escritorio."],
    ], [0.7, 2.1, 3.9])
    add_heading(doc, "8 3 Hoja de ruta de integracion", 2)
    add_table(doc, ["Prioridad", "Siguiente incremento tecnico", "Criterio de terminacion"], [
        ["Alta", "Reemplazar repositorio simulado por cliente HTTP y exponer GET y POST de listings.", "Catalogo y publicacion consultan API de prueba con datos persistentes."],
        ["Alta", "Registro, login y verificacion institucional.", "Rutas privadas protegidas y contrasenas no expuestas en texto plano."],
        ["Media", "Mensajeria, favoritos y operaciones con reglas de estado.", "Cada accion persiste y respeta propietario, disponibilidad y permisos."],
        ["Media", "Moderacion, calificaciones, metricas y despliegue continuo.", "Reportes administrables, bitacora y ambiente de produccion configurado."],
    ], [0.9, 3.2, 2.6])
    add_body(doc, "La arquitectura permite demostrar el flujo de CampusTrade en la fase alfa y evolucionar a una aplicacion con API y base de datos sin sustituir el diseno de interfaz. Los componentes futuros se incorporan detras de contratos explicitamente definidos.")

    doc.core_properties.title = "Especificacion tecnica CampusTrade"
    doc.core_properties.subject = "Arquitectura componentes tecnicos y APIs del prototipo CampusTrade"
    doc.core_properties.author = "Equipo 3 MEX-PER ISC"
    doc.save(OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    build()
