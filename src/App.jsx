import { useEffect, useMemo, useState } from "react";
import { careers, conditions, modalities } from "./data/mockListings";
import { listingRepository } from "./services/listingRepository";

const navItems = [
  ["home", "Inicio"],
  ["search", "Explorar"],
  ["heart", "Favoritos"],
  ["message", "Mensajes"],
  ["user", "Perfil"],
];

const categoryItems = [
  ["Electrónica", "chip", "Componentes, kits y circuitos"],
  ["Laboratorio", "flask", "Material para prácticas"],
  ["Libros", "book", "Textos y apuntes"],
  ["Herramientas", "tool", "Medición y taller"],
];

function Icon({ name, size = 20, stroke = 1.8 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-6h6v6"/></>,
    search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.25 4.25"/></>,
    heart: <path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z"/>,
    message: <><path d="M20 11.2a7.7 7.7 0 0 1-8 7.3c-1.2 0-2.4-.25-3.4-.75L4 19l1.35-3.65A7.15 7.15 0 0 1 4 11.2 7.7 7.7 0 0 1 12 4a7.7 7.7 0 0 1 8 7.2Z"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M9.7 21h4.6"/></>,
    pin: <><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    star: <path d="m12 3 2.78 5.63L21 9.54l-4.5 4.38 1.06 6.18L12 17.18 6.44 20.1 7.5 13.92 3 9.54l6.22-.91Z"/>,
    check: <path d="m5 12 4.3 4.3L19 6.7"/>,
    filter: <><path d="M3 5h18M6 12h12m-9 7h6"/></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    chip: <><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 1v3m6-3v3m-6 16v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3"/></>,
    flask: <><path d="M9 3h6m-3 0v6l5.5 8.4A2.4 2.4 0 0 1 15.5 21h-7a2.4 2.4 0 0 1-2-3.6L12 9"/><path d="M8.3 16h7.4"/></>,
    book: <><path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12v16H7a2.5 2.5 0 0 0-2.5 2.5z"/><path d="M4.5 5.5V21M9 7h6"/></>,
    tool: <><path d="m14.7 6.2 3.1-3.1a4.25 4.25 0 0 1-5.6 5.6L5 15.9a2.4 2.4 0 0 0 3.4 3.4l7.2-7.2a4.25 4.25 0 0 1 5.6-5.6l-3.1 3.1"/></>,
    send: <><path d="m21 3-8.5 18-2.3-7.2L3 11.5z"/><path d="M10.2 13.8 15 9"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m3 17 5-5 4 4 2-2 4 3"/></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function ListingVisual({ type, large = false }) {
  const graphic = {
    arduino: <><rect x="22" y="31" width="76" height="49" rx="9" fill="#167c68"/><circle cx="41" cy="55" r="9" fill="#d6f2d6"/><circle cx="78" cy="55" r="9" fill="#d6f2d6"/><path d="M28 80v13m13-13v8m30-8v13m14-13v8" stroke="#134c42" strokeWidth="4"/><path d="M34 31V18m51 13V18" stroke="#f3b849" strokeWidth="4"/></>,
    coat: <><path d="M48 22 60 14l12 8 18 9-8 18-10-4v51H48V45l-10 4-8-18z" fill="#f8fbf9" stroke="#b4c9c1" strokeWidth="3"/><path d="m48 22 12 13 12-13M60 35v61" stroke="#b4c9c1" strokeWidth="3"/></>,
    caliper: <><path d="M25 47h77v11H25zM38 47V26h10v21m15 11v19h13V58m13-11V30h9v17" fill="#dce9e5" stroke="#47736a" strokeWidth="3"/><path d="M25 58h77" stroke="#47736a" strokeWidth="3"/></>,
    book: <><path d="M34 27c15-8 27 2 27 2v63s-12-10-27-2z" fill="#f7b94e"/><path d="M88 27c-15-8-27 2-27 2v63s12-10 27-2z" fill="#e59438"/><path d="M61 29v63M38 42h18m9 0h18" stroke="#774716" strokeWidth="3"/></>,
    gloves: <><path d="M44 87c-10-5-12-18-6-30l7-14c3-6 10-4 9 2l-3 10 7-19c3-7 11-4 9 3l-5 17 8-15c4-6 11-1 8 5l-6 14 6-8c5-6 11 0 6 7L64 80c-5 11-12 15-20 7Z" fill="#a7cfe4" stroke="#4685a8" strokeWidth="3"/></>,
    circuit: <><rect x="26" y="27" width="70" height="65" rx="8" fill="#d7eee5" stroke="#4c927c" strokeWidth="3"/><path d="M39 45h16v-9h25m-41 28h20v14h27M75 45v18h12" stroke="#4c927c" strokeWidth="4"/><circle cx="80" cy="36" r="5" fill="#f4b746"/><circle cx="86" cy="78" r="5" fill="#f4b746"/></>,
  }[type] ?? null;
  return <div className={`listing-visual ${large ? "is-large" : ""} visual-${type}`}><svg viewBox="0 0 120 120" role="img" aria-label="Ilustración del artículo">{graphic}</svg></div>;
}

function Badge({ modality }) {
  return <span className={`badge badge-${modality.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>{modality}</span>;
}

function ProductCard({ item, isFavorite, onFavorite, onOpen }) {
  const price = item.modality === "Donación" ? "Gratis" : item.modality === "Intercambio" ? "Intercambio" : item.modality === "Renta" ? `$${item.rentalPrice} / día` : `$${item.price}`;
  return <article className="product-card" onClick={() => onOpen(item)}>
    <div className="card-media">
      <ListingVisual type={item.image} />
      <Badge modality={item.modality} />
      <button className={`icon-button favorite-button ${isFavorite ? "is-favorite" : ""}`} onClick={(event) => { event.stopPropagation(); onFavorite(item.id); }} aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}><Icon name="heart" size={18} /></button>
    </div>
    <div className="card-body">
      <p className="eyebrow">{item.career}</p>
      <h3>{item.title}</h3>
      <p className="card-price">{price}</p>
      <div className="card-meta"><span>{item.condition}</span><span>•</span><span>{item.posted}</span></div>
      <div className="seller-mini"><span className="avatar avatar-small">{item.seller.initials}</span><span>{item.seller.name}</span><span className="seller-rating"><Icon name="star" size={13} /> {item.seller.rating.toFixed(1)}</span></div>
    </div>
  </article>;
}

function EmptyState({ title, text, action }) {
  return <div className="empty-state"><div className="empty-mark"><Icon name="heart" size={27} /></div><h2>{title}</h2><p>{text}</p>{action}</div>;
}

function App() {
  const [listings, setListings] = useState([]);
  const [activeView, setActiveView] = useState("Inicio");
  const [favorites, setFavorites] = useState(["ct-001"]);
  const [selected, setSelected] = useState(null);
  const [showPublish, setShowPublish] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeThread, setActiveThread] = useState("Mariana López");
  const [filters, setFilters] = useState({ query: "", career: "Todas", modality: "Todos", condition: "Todas" });

  useEffect(() => { listingRepository.getAll().then(setListings); }, []);
  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const filtered = useMemo(() => listings.filter((item) => {
    const query = filters.query.trim().toLowerCase();
    const matchesQuery = !query || `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query);
    return matchesQuery && (filters.career === "Todas" || item.career === filters.career) && (filters.modality === "Todos" || item.modality === filters.modality) && (filters.condition === "Todas" || item.condition === filters.condition);
  }), [filters, listings]);

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  const browse = (updates = {}) => { setFilters((current) => ({ ...current, ...updates })); setActiveView("Explorar"); };
  const openMessages = (item) => { setActiveThread(item.seller.name); setSelected(null); setActiveView("Mensajes"); setToast(`Conversación con ${item.seller.name} lista para comenzar.`); };
  const sendMessage = (event) => { event.preventDefault(); if (!messageText.trim()) return; setToast("Mensaje enviado en el prototipo."); setMessageText(""); };

  async function createListing(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const modality = form.get("modality");
    const created = await listingRepository.create({
      title: form.get("title"), price: Number(form.get("price") || 0), rentalPrice: Number(form.get("price") || 0), modality, category: form.get("category"), career: form.get("career"), condition: form.get("condition"), image: "book", description: form.get("description"), location: "Por acordar", posted: "Ahora", seller: { name: "Tú", initials: "TU", rating: 5, verified: true },
    });
    setListings((current) => [created, ...current]);
    setShowPublish(false);
    setActiveView("Explorar");
    setToast("Tu publicación se agregó al catálogo local.");
    event.currentTarget.reset();
  }

  const catalog = activeView === "Favoritos" ? listings.filter((item) => favorites.includes(item.id)) : filtered;
  const catalogTitle = activeView === "Favoritos" ? "Tus favoritos" : activeView === "Explorar" ? "Explora el catálogo" : "Publicaciones recientes";

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setActiveView("Inicio")} aria-label="Ir a inicio"><span className="brand-mark">ct</span><span>Campus<span>Trade</span></span></button>
      <nav className="main-nav" aria-label="Navegación principal">{navItems.map(([icon, label]) => <button key={label} className={activeView === label ? "active" : ""} onClick={() => setActiveView(label)}><Icon name={icon} size={18} />{label}{label === "Mensajes" && <i className="unread-dot" />}</button>)}</nav>
      <div className="header-actions"><button className="icon-button notification" aria-label="Notificaciones"><Icon name="bell" size={20} /><i /></button><button className="user-avatar" onClick={() => setActiveView("Perfil")}>AM</button></div>
    </header>

    <main>
      {activeView === "Inicio" && <>
        <section className="hero">
          <div className="hero-copy"><p className="hero-kicker"><span />Comercio entre estudiantes</p><h1>Lo que ya no usas,<br /><em>alguien lo necesita.</em></h1><p>Compra, renta, intercambia o dona materiales académicos con estudiantes de tu universidad.</p><div className="hero-actions"><button className="button button-primary" onClick={() => browse()}>Explorar artículos <Icon name="arrow" size={18} /></button><button className="button button-secondary" onClick={() => setShowPublish(true)}><Icon name="plus" size={18} />Publicar artículo</button></div><div className="trust-line"><span><Icon name="check" size={15} />Solo estudiantes verificados</span><span><Icon name="pin" size={15} />Entregas en el campus</span></div></div>
          <div className="hero-art" aria-hidden="true"><div className="hero-circle"/><div className="hero-card hero-card-main"><ListingVisual type="arduino" large /><div><span>Kit Arduino Uno</span><strong>$480</strong></div></div><div className="hero-card hero-card-float"><span className="avatar avatar-small">RM</span><div><strong>Usuario verificado</strong><small><Icon name="star" size={12} /> 4.8 de reputación</small></div><span className="verified"><Icon name="check" size={12}/></span></div><div className="hero-spark spark-one">✦</div><div className="hero-spark spark-two">✦</div></div>
        </section>
        <section className="category-section"><div className="section-title"><div><p className="eyebrow">Encuentra lo que buscas</p><h2>Explora por categoría</h2></div><button className="text-link" onClick={() => browse()}>Ver todo <Icon name="arrow" size={16} /></button></div><div className="category-grid">{categoryItems.map(([title, icon, text]) => <button key={title} className="category-card" onClick={() => browse({ query: title === "Herramientas" ? "Vernier" : title })}><span className="category-icon"><Icon name={icon} size={25} /></span><span><strong>{title}</strong><small>{text}</small></span><Icon name="arrow" size={18} /></button>)}</div></section>
        <section className="catalog-section home-catalog"><div className="section-title"><div><p className="eyebrow">Catálogo comunitario</p><h2>Recién publicados</h2></div><button className="text-link" onClick={() => browse()}>Ver catálogo <Icon name="arrow" size={16} /></button></div><div className="product-grid">{listings.slice(0, 4).map((item) => <ProductCard key={item.id} item={item} isFavorite={favorites.includes(item.id)} onFavorite={toggleFavorite} onOpen={setSelected} />)}</div></section>
      </>}

      {(activeView === "Explorar" || activeView === "Favoritos") && <section className="explore-page"><div className="page-heading"><div><p className="eyebrow">CampusTrade</p><h1>{catalogTitle}</h1><p>{activeView === "Favoritos" ? "Tus artículos guardados para revisarlos después." : "Materiales académicos disponibles en tu comunidad."}</p></div><button className="button button-primary" onClick={() => setShowPublish(true)}><Icon name="plus" size={18} />Publicar</button></div>{activeView === "Explorar" && <div className="filter-bar"><label className="search-field"><Icon name="search" size={20}/><input value={filters.query} onChange={(event) => setFilter("query", event.target.value)} placeholder="Buscar libros, herramientas, materiales..." /></label><button className="filter-button" onClick={() => setShowFilters((current) => !current)}><Icon name="filter" size={18} />Filtros <span>{(filters.career !== "Todas" ? 1 : 0) + (filters.modality !== "Todos" ? 1 : 0) + (filters.condition !== "Todas" ? 1 : 0)}</span></button></div>}{activeView === "Explorar" && showFilters && <div className="filter-panel"><FilterSelect label="Carrera" options={careers} value={filters.career} onChange={(value) => setFilter("career", value)} /><FilterSelect label="Modalidad" options={modalities} value={filters.modality} onChange={(value) => setFilter("modality", value)} /><FilterSelect label="Condición" options={conditions} value={filters.condition} onChange={(value) => setFilter("condition", value)} /><button className="clear-filters" onClick={() => setFilters({ query: "", career: "Todas", modality: "Todos", condition: "Todas" })}>Limpiar filtros</button></div>}<div className="result-bar"><span>{catalog.length} {catalog.length === 1 ? "resultado" : "resultados"}</span>{activeView === "Explorar" && <span>Ordenado por más recientes</span>}</div>{catalog.length ? <div className="product-grid">{catalog.map((item) => <ProductCard key={item.id} item={item} isFavorite={favorites.includes(item.id)} onFavorite={toggleFavorite} onOpen={setSelected} />)}</div> : <EmptyState title="Aún no hay favoritos" text="Guarda los materiales que te interesen y aparecerán aquí." action={<button className="button button-primary" onClick={() => setActiveView("Explorar")}>Explorar artículos</button>} />}</section>}

      {activeView === "Mensajes" && <Messages activeThread={activeThread} messageText={messageText} setMessageText={setMessageText} onSubmit={sendMessage} onThread={setActiveThread} />}
      {activeView === "Perfil" && <Profile onPublish={() => setShowPublish(true)} />}
    </main>

    <footer><span>CampusTrade <b>α</b></span><span>Prototipo sin pagos ni datos reales</span><span>Universidad · Comunidad segura</span></footer>
    {selected && <ProductModal item={selected} isFavorite={favorites.includes(selected.id)} onFavorite={toggleFavorite} onClose={() => setSelected(null)} onMessage={openMessages} />}
    {showPublish && <PublishModal onClose={() => setShowPublish(false)} onSubmit={createListing} />}
    {toast && <div className="toast"><Icon name="check" size={18} />{toast}</div>}
  </div>;
}

function FilterSelect({ label, options, value, onChange }) { return <label className="filter-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }

function ProductModal({ item, isFavorite, onFavorite, onClose, onMessage }) {
  const price = item.modality === "Donación" ? "Gratis" : item.modality === "Intercambio" ? "Propón un intercambio" : item.modality === "Renta" ? `$${item.rentalPrice} por día` : `$${item.price}`;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="product-modal" role="dialog" aria-modal="true" aria-label={item.title} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button><div className="detail-visual"><ListingVisual type={item.image} large /></div><div className="detail-content"><div className="detail-topline"><Badge modality={item.modality}/><button className={`icon-button favorite-button ${isFavorite ? "is-favorite" : ""}`} onClick={() => onFavorite(item.id)}><Icon name="heart" size={18}/></button></div><p className="eyebrow">{item.career} · {item.category}</p><h2>{item.title}</h2><p className="detail-price">{price}</p><p className="detail-description">{item.description}</p><div className="detail-facts"><span><b>Condición</b>{item.condition}</span><span><b>Entrega</b>{item.location}</span></div><div className="seller-detail"><span className="avatar">{item.seller.initials}</span><div><strong>{item.seller.name}</strong><small><span className="verified-text"><Icon name="check" size={12}/> Verificado</span> · <Icon name="star" size={13}/> {item.seller.rating.toFixed(1)}</small></div><button className="text-link">Ver perfil <Icon name="arrow" size={15}/></button></div><button className="button button-primary message-cta" onClick={() => onMessage(item)}><Icon name="message" size={18}/>Contactar a {item.seller.name.split(" ")[0]}</button><p className="safe-note"><Icon name="pin" size={15}/>Acordar la entrega dentro de la institución.</p></div></section></div>;
}

function PublishModal({ onClose, onSubmit }) { return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><form className="publish-modal" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button><p className="eyebrow">Nuevo artículo</p><h2>Publica para tu comunidad</h2><p className="form-intro">Se guardará solo durante esta demostración. Después se conectará a la base de datos.</p><label>Título<input name="title" required placeholder="Ej. Calculadora científica" /></label><div className="form-row"><label>Modalidad<select name="modality" defaultValue="Venta">{modalities.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Precio (MXN)<input name="price" type="number" min="0" placeholder="0" /></label></div><div className="form-row"><label>Categoría<select name="category">{categoryItems.map(([item]) => <option key={item}>{item}</option>)}</select></label><label>Carrera<select name="career">{careers.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label></div><label>Condición<select name="condition">{conditions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Descripción<textarea name="description" required rows="3" placeholder="Cuenta qué incluye, estado y detalles importantes." /></label><div className="image-placeholder"><Icon name="image" size={20}/><span>Las imágenes se conectarán al almacenamiento del proyecto.</span></div><button className="button button-primary" type="submit">Publicar artículo <Icon name="arrow" size={18}/></button></form></div>; }

function Messages({ activeThread, messageText, setMessageText, onSubmit, onThread }) { const threads = [["Mariana López", "ML", "Claro, te lo puedo mostrar mañana."], ["Regina Morales", "RM", "La bata sigue disponible."], ["Equipo CampusTrade", "CT", "Recuerda reunirte dentro del campus."]]; return <section className="messages-page"><div className="page-heading"><div><p className="eyebrow">Comunicación segura</p><h1>Mensajes</h1><p>Coordina detalles de manera clara y dentro de la universidad.</p></div></div><div className="messages-layout"><aside className="thread-list"><div className="thread-search"><Icon name="search" size={18}/><input placeholder="Buscar conversación"/></div>{threads.map(([name, initials, preview]) => <button className={activeThread === name ? "thread active" : "thread"} onClick={() => onThread(name)} key={name}><span className="avatar">{initials}</span><span><strong>{name}</strong><small>{preview}</small></span>{name === "Mariana López" && <i/>}</button>)}</aside><section className="conversation"><header><span className="avatar">{activeThread.split(" ").map((word) => word[0]).join("").slice(0,2)}</span><div><strong>{activeThread}</strong><small><span className="online-dot"/> Estudiante verificado</small></div><button className="icon-button"><Icon name="user" size={19}/></button></header><div className="chat-body"><div className="chat-system">Hoy</div><div className="chat-bubble received">¡Hola! Vi tu artículo en CampusTrade. ¿Todavía está disponible?<small>10:24</small></div><div className="chat-bubble sent">¡Hola! Sí, aún está disponible. Podemos acordar la entrega dentro del campus.<small>10:27</small></div><div className="chat-tip"><Icon name="pin" size={16}/>Por seguridad, acuerden un punto de encuentro dentro de la institución.</div></div><form className="message-composer" onSubmit={onSubmit}><button type="button" className="icon-button"><Icon name="plus" size={20}/></button><input value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Escribe un mensaje..."/><button className="send-button" aria-label="Enviar mensaje"><Icon name="send" size={18}/></button></form></section></div></section>; }

function Profile({ onPublish }) { return <section className="profile-page"><div className="profile-cover"/><div className="profile-hero"><span className="profile-avatar">AM</span><div><p className="eyebrow">Estudiante verificado</p><h1>Andrea Martínez</h1><p>Mecatrónica · 5.º semestre</p></div><button className="button button-secondary" onClick={onPublish}><Icon name="plus" size={18}/>Publicar artículo</button></div><div className="profile-grid"><section><h2>Tu actividad</h2><div className="stat-row"><span><strong>3</strong>Publicaciones</span><span><strong>7</strong>Operaciones</span><span><strong>4.9 <Icon name="star" size={15}/></strong>Reputación</span></div><h2 className="subsection-title">Tus publicaciones</h2><div className="profile-placeholder"><Icon name="plus" size={22}/><div><strong>Publica algo que ya no utilices</strong><p>Podrás editar o marcar como finalizadas tus publicaciones aquí.</p></div></div></section><aside className="profile-info"><h2>Información</h2><p><Icon name="check" size={16}/>Cuenta validada con correo institucional</p><p><Icon name="pin" size={16}/>Preferencia de entrega: campus</p><p><Icon name="calendar" size={16}/>Miembro desde 2026</p><hr/><button className="text-link">Editar perfil <Icon name="arrow" size={16}/></button></aside></div></section>; }

export default App;
