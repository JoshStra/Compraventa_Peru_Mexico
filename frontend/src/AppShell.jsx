import { useEffect, useMemo, useState } from "react";
import {
  careers,
  categories,
  conditions,
  emptyFilters,
  filterListings,
  modalities,
} from "./domain/catalog.js";
import { campusRepository, STORAGE_KEY } from "./services/campusRepository.js";
import { Icon, ListingVisual } from "./components/Visuals.jsx";
import {
  EmptyState,
  ProductCard,
  ProductDetail,
} from "./components/Catalog.jsx";
import { ListingForm } from "./components/ListingForm.jsx";
import { Messages } from "./components/Messages.jsx";
import { Profile, ProfileForm, ReportForm } from "./components/Profile.jsx";
import { Modal } from "./components/Modal.jsx";

const navItems = [
  ["home", "Inicio"],
  ["search", "Explorar"],
  ["heart", "Favoritos"],
  ["message", "Mensajes"],
  ["user", "Perfil"],
];
const categoryIcons = ["chip", "flask", "book", "tool"];

function initialLoad() {
  try {
    return { data: campusRepository.getSnapshot(), error: "" };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(initialLoad);
  const data = loaded.data;
  const [activeView, setActiveView] = useState("Inicio");
  const [filters, setFilters] = useState({ ...emptyFilters });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [seller, setSeller] = useState(null);
  const [report, setReport] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    function sync(event) {
      if (event.key === STORAGE_KEY || event.key === null)
        setLoaded(initialLoad());
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(
    () => filterListings(data?.listings || [], filters),
    [data, filters],
  );
  function commit(operation) {
    const next = operation();
    setLoaded({ data: next, error: "" });
    setError("");
    return next;
  }
  function act(operation, message) {
    try {
      const next = commit(operation);
      if (message) setToast(message);
      return next;
    } catch (failure) {
      setError(failure.message);
      return null;
    }
  }
  const toggleFavorite = (id) => act(() => campusRepository.toggleFavorite(id));
  const setFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const browse = (updates = {}) => {
    setFilters({ ...emptyFilters, ...updates });
    setActiveView("Explorar");
  };
  function openMessages(id) {
    const next = act(() => campusRepository.openThread(id));
    if (!next) return;
    setActiveThread(next.threads.find((thread) => thread.listingId === id).id);
    setSelectedId(null);
    setActiveView("Mensajes");
  }
  function saveListing(input) {
    commit(() =>
      editing.id
        ? campusRepository.updateListing(editing.id, input)
        : campusRepository.createListing(input),
    );
    setEditing(null);
    browse();
    setToast("Publicación guardada en este navegador.");
  }
  function exportData() {
    try {
      const blob = new Blob(
        [JSON.stringify(campusRepository.getSnapshot(), null, 2)],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "campustrade-datos.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Allow the browser to finish consuming the Blob before releasing it.
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (failure) {
      setError(failure.message);
    }
  }

  if (!data)
    return (
      <main className="load-error">
        <h1>No pudimos abrir CampusTrade</h1>
        <p role="alert">{loaded.error}</p>
        <button
          className="button button-primary"
          onClick={() => setLoaded(initialLoad())}
        >
          Reintentar
        </button>
        <button
          className="button button-secondary"
          onClick={() => {
            if (
              window.confirm(
                "Se eliminarán los cambios locales de CampusTrade de este navegador. ¿Restablecer la demostración?",
              )
            )
              act(() => campusRepository.reset());
          }}
        >
          Restablecer demostración
        </button>
        {error && <p role="alert">{error}</p>}
      </main>
    );

  const selected = data.listings.find((item) => item.id === selectedId);
  const catalog =
    activeView === "Favoritos"
      ? data.listings.filter((item) => data.favorites.includes(item.id))
      : filtered;
  const cards = (items) => (
    <div className="product-grid">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          isFavorite={data.favorites.includes(item.id)}
          onFavorite={toggleFavorite}
          onOpen={setSelectedId}
        />
      ))}
    </div>
  );
  const filterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "query" && value !== emptyFilters[key],
  ).length;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setActiveView("Inicio")}
          aria-label="Ir a inicio"
        >
          <span className="brand-mark">ct</span>
          <span>
            Campus<span>Trade</span>
          </span>
        </button>
        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map(([icon, label]) => (
            <button
              key={label}
              className={activeView === label ? "active" : ""}
              aria-current={activeView === label ? "page" : undefined}
              onClick={() => setActiveView(label)}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </nav>
        <button
          className="user-avatar"
          onClick={() => setActiveView("Perfil")}
          aria-label="Abrir mi perfil"
        >
          {data.profile.initials}
        </button>
      </header>
      <p className="local-notice">
        Modo local · Tus cambios se guardan en este navegador. El catálogo
        inicial contiene ejemplos.
      </p>
      {error && !selected && (
        <div className="global-error" role="alert">
          <span>{error}</span>
          <button className="text-link" onClick={() => setError("")}>
            Cerrar aviso
          </button>
        </div>
      )}
      <main id="contenido">
        {activeView === "Inicio" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="hero-kicker">
                  <span />
                  Comercio entre estudiantes
                </p>
                <h1>
                  Lo que ya no usas,
                  <br />
                  <em>alguien lo necesita.</em>
                </h1>
                <p>
                  Compra, renta, intercambia o dona materiales académicos de tu
                  comunidad.
                </p>
                <div className="hero-actions">
                  <button
                    className="button button-primary"
                    onClick={() => browse()}
                  >
                    Explorar artículos <Icon name="arrow" size={18} />
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => setEditing({})}
                  >
                    <Icon name="plus" size={18} />
                    Publicar artículo
                  </button>
                </div>
                <div className="trust-line">
                  <span>
                    <Icon name="check" size={15} />
                    Cuatro formas de reutilizar
                  </span>
                  <span>
                    <Icon name="pin" size={15} />
                    Entrega en el campus
                  </span>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="hero-circle" />
                <div className="hero-card hero-card-main">
                  <ListingVisual type="arduino" large />
                  <div>
                    <span>Kit Arduino Uno</span>
                    <strong>$480</strong>
                  </div>
                </div>
                <div className="hero-card hero-card-float">
                  <span className="avatar avatar-small">CT</span>
                  <div>
                    <strong>Más vida a tus materiales</strong>
                    <small>Venta, renta, intercambio y donación</small>
                  </div>
                </div>
                <div className="hero-spark spark-one">✦</div>
                <div className="hero-spark spark-two">✦</div>
              </div>
            </section>
            <section className="category-section">
              <div className="section-title">
                <div>
                  <p className="eyebrow">Encuentra lo que buscas</p>
                  <h2>Explora por categoría</h2>
                </div>
                <button className="text-link" onClick={() => browse()}>
                  Ver todo <Icon name="arrow" size={16} />
                </button>
              </div>
              <div className="category-grid">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className="category-card"
                    onClick={() => browse({ category })}
                  >
                    <span className="category-icon">
                      <Icon name={categoryIcons[index]} size={25} />
                    </span>
                    <strong>{category}</strong>
                    <Icon name="arrow" size={18} />
                  </button>
                ))}
              </div>
            </section>
            <section className="catalog-section home-catalog">
              <div className="section-title">
                <div>
                  <p className="eyebrow">Catálogo comunitario</p>
                  <h2>Recién publicados</h2>
                </div>
                <button className="text-link" onClick={() => browse()}>
                  Ver catálogo <Icon name="arrow" size={16} />
                </button>
              </div>
              {cards(
                data.listings
                  .filter((item) => item.status === "Disponible")
                  .slice(0, 4),
              )}
            </section>
          </>
        )}
        {["Explorar", "Favoritos"].includes(activeView) && (
          <section className="explore-page">
            <div className="page-heading">
              <div>
                <p className="eyebrow">CampusTrade</p>
                <h1>
                  {activeView === "Favoritos"
                    ? "Tus favoritos"
                    : "Explora el catálogo"}
                </h1>
                <p>
                  {activeView === "Favoritos"
                    ? "Los artículos que guardaste para revisar después."
                    : "Materiales disponibles para darles un nuevo uso."}
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => setEditing({})}
              >
                <Icon name="plus" size={18} />
                Publicar
              </button>
            </div>
            {activeView === "Explorar" && (
              <>
                <div className="filter-bar">
                  <label className="search-field">
                    <Icon name="search" size={20} />
                    <input
                      aria-label="Buscar artículos"
                      value={filters.query}
                      onChange={(event) =>
                        setFilter("query", event.target.value)
                      }
                      placeholder="Buscar libros, herramientas, materiales…"
                    />
                  </label>
                  <button
                    className="filter-button"
                    aria-label={`Filtros, ${filterCount} activos`}
                    aria-expanded={showFilters}
                    aria-controls="filtros-catalogo"
                    onClick={() => setShowFilters((current) => !current)}
                  >
                    <Icon name="filter" size={18} />
                    Filtros <span>{filterCount}</span>
                  </button>
                </div>
                {showFilters && (
                  <div className="filter-panel" id="filtros-catalogo">
                    <FilterSelect
                      label="Carrera"
                      options={careers}
                      value={filters.career}
                      onChange={(value) => setFilter("career", value)}
                    />
                    <FilterSelect
                      label="Modalidad"
                      options={modalities}
                      value={filters.modality}
                      onChange={(value) => setFilter("modality", value)}
                    />
                    <FilterSelect
                      label="Condición"
                      options={conditions}
                      value={filters.condition}
                      onChange={(value) => setFilter("condition", value)}
                    />
                    <FilterSelect
                      label="Categoría"
                      options={["Todas", ...categories]}
                      value={filters.category}
                      onChange={(value) => setFilter("category", value)}
                    />
                    <FilterSelect
                      label="Disponibilidad"
                      options={[
                        "Todos",
                        "Disponible",
                        "Reservado",
                        "Finalizado",
                      ]}
                      value={filters.status}
                      onChange={(value) => setFilter("status", value)}
                    />
                    <label className="filter-select">
                      Precio mínimo
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={filters.minPrice}
                        onChange={(event) =>
                          setFilter("minPrice", event.target.value)
                        }
                      />
                    </label>
                    <label className="filter-select">
                      Precio máximo
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={filters.maxPrice}
                        onChange={(event) =>
                          setFilter("maxPrice", event.target.value)
                        }
                      />
                    </label>
                    {filters.minPrice !== "" &&
                      filters.maxPrice !== "" &&
                      Number(filters.minPrice) > Number(filters.maxPrice) && (
                        <p className="field-error" role="alert">
                          El precio mínimo supera al máximo.
                        </p>
                      )}
                    <button
                      className="clear-filters"
                      onClick={() => setFilters({ ...emptyFilters })}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="result-bar" role="status">
              <span>
                {catalog.length}{" "}
                {catalog.length === 1 ? "resultado" : "resultados"}
              </span>
              <span>Más recientes primero</span>
            </div>
            {catalog.length ? (
              cards(catalog)
            ) : (
              <EmptyState
                title={
                  activeView === "Favoritos"
                    ? "Aún no hay favoritos"
                    : "No encontramos artículos"
                }
                text={
                  activeView === "Favoritos"
                    ? "Guarda un artículo del catálogo para verlo aquí."
                    : "Prueba otra búsqueda o limpia los filtros."
                }
                action={
                  <button
                    className="button button-primary"
                    onClick={() => browse()}
                  >
                    {activeView === "Favoritos"
                      ? "Explorar artículos"
                      : "Limpiar búsqueda y filtros"}
                  </button>
                }
              />
            )}
          </section>
        )}
        {activeView === "Mensajes" && (
          <Messages
            threads={data.threads}
            activeId={activeThread}
            onThread={setActiveThread}
            onSend={(id, body) =>
              commit(() => campusRepository.sendMessage(id, body))
            }
            onExplore={() => browse()}
          />
        )}
        {activeView === "Perfil" && (
          <Profile
            data={data}
            onPublish={() => setEditing({})}
            onEditProfile={() => setEditingProfile(true)}
            onEditListing={setEditing}
            onStatus={(id, status) =>
              act(
                () => campusRepository.setListingStatus(id, status),
                "Disponibilidad actualizada.",
              )
            }
            onExport={exportData}
          />
        )}
      </main>
      <footer>
        <span>
          CampusTrade <b>α</b>
        </span>
        <span>Versión 0.2.0 · Demostración local</span>
        <span>Reutiliza · Comparte · Conecta</span>
      </footer>
      {selected && (
        <ProductDetail
          item={selected}
          error={error}
          profileId={data.profile.id}
          isFavorite={data.favorites.includes(selected.id)}
          onClose={() => setSelectedId(null)}
          onFavorite={toggleFavorite}
          onMessage={openMessages}
          onSeller={(person) => {
            setSelectedId(null);
            setSeller(person);
          }}
          onReport={(item) => {
            setSelectedId(null);
            setReport(item);
          }}
          onManage={() => {
            setSelectedId(null);
            setActiveView("Perfil");
          }}
        />
      )}
      {editing && (
        <ListingForm
          item={editing}
          onSave={saveListing}
          onClose={() => setEditing(null)}
        />
      )}
      {editingProfile && (
        <ProfileForm
          profile={data.profile}
          onClose={() => setEditingProfile(false)}
          onSave={(input) => {
            commit(() => campusRepository.updateProfile(input));
            setEditingProfile(false);
            setToast("Perfil actualizado.");
          }}
        />
      )}
      {seller && (
        <Modal title={seller.name} onClose={() => setSeller(null)}>
          <p>
            {seller.id === data.profile.id
              ? "Tu perfil local"
              : "Perfil de demostración"}
          </p>
          <p>{seller.career || "Comunidad universitaria"}</p>
          <p>
            {seller.rating > 0
              ? `Reputación de muestra: ${seller.rating.toFixed(1)} / 5`
              : "Sin calificaciones"}
          </p>
          <p>
            La verificación institucional estará disponible al conectar el
            servicio de cuentas.
          </p>
        </Modal>
      )}
      {report && (
        <ReportForm
          item={report}
          onClose={() => setReport(null)}
          onSave={(id, input) => {
            commit(() => campusRepository.reportListing(id, input));
            setReport(null);
            setToast("Reporte guardado en tu perfil local.");
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
