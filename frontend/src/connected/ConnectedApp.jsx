import { useEffect, useState } from "react";
import {
  api,
  decorateListing,
  initials,
  modalityLabels,
  conditionLabels,
  statusLabels,
  money,
  imageUrl,
} from "../services/apiClient.js";
import { Icon, ListingVisual, Badge } from "../components/Visuals.jsx";
import { ProductCard, EmptyState } from "../components/Catalog.jsx";
import { Modal } from "../components/Modal.jsx";
import {
  AuthDialog,
  TokenDialog,
  ListingDialog,
  ProfileDialog,
  ReportDialog,
  ConfirmDialog,
} from "./Forms.jsx";
import { Messenger } from "./Messenger.jsx";
import {
  OperationDialog,
  RatingDialog,
  OperationsPage,
} from "./Operations.jsx";
import { AdminPage, ResolutionDialog, CatalogDialog } from "./Admin.jsx";

const emptyFilters = {
  q: "",
  career: "",
  categoryId: "",
  modality: "",
  condition: "",
  status: "available",
  minPrice: "",
  maxPrice: "",
  page: 1,
  limit: 12,
};
const emptyAccount = {
  own: [],
  favorites: [],
  reports: [],
  threads: [],
  operations: [],
  profile: null,
};
const nav = [
  ["home", "Inicio"],
  ["search", "Explorar"],
  ["heart", "Favoritos"],
  ["message", "Mensajes"],
  ["calendar", "Operaciones"],
  ["user", "Perfil"],
];

function initialLink() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  for (const action of ["verify", "reset"]) {
    const token = params.get(action);
    if (token) return { type: "token", action, token };
  }
  return null;
}

export default function ConnectedApp() {
  const [catalog, setCatalog] = useState(null);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("Inicio");
  const [filters, setFilters] = useState({ ...emptyFilters });
  const [result, setResult] = useState({
    items: [],
    total: 0,
    page: 1,
    limit: 12,
  });
  const [account, setAccount] = useState({ ...emptyAccount });
  const [dialog, setDialog] = useState(initialLink);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [fatal, setFatal] = useState("");
  const [boot, setBoot] = useState(0);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [messageThread, setMessageThread] = useState(null);
  useEffect(() => {
    const changed = () => {
      const link = initialLink();
      if (link) setDialog(link);
    };
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([api.catalog(), api.session()])
      .then(([metadata, session]) => {
        if (active) {
          setCatalog(metadata);
          setUser(session.user);
          setFatal("");
        }
      })
      .catch((failure) => {
        if (active) setFatal(failure.message);
      });
    return () => {
      active = false;
    };
  }, [boot]);
  useEffect(() => {
    if (!catalog) return;
    const abort = new AbortController();
    setLoading(true);
    api
      .listings(filters, abort.signal)
      .then((data) => {
        setResult(data);
        setError("");
      })
      .catch((failure) => {
        if (failure.name !== "AbortError") setError(failure.message);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [catalog, filters, revision]);
  useEffect(() => {
    if (!user) {
      setAccount({ ...emptyAccount });
      return;
    }
    let active = true;
    setAccountLoading(true);
    Promise.all([
      api.own(),
      api.favorites(),
      api.reports(),
      api.conversations(),
      api.operations(),
      api.publicProfile(user.id),
    ])
      .then(([own, favorites, reports, threads, operations, profile]) => {
        if (active)
          setAccount({
            own: own.items,
            favorites: favorites.ids,
            reports: reports.items,
            threads: threads.items,
            operations: operations.items,
            profile: profile.user,
          });
      })
      .catch((failure) => {
        if (active) {
          setError(failure.message);
          if (failure.status === 401) {
            setUser(null);
            setView("Inicio");
          }
        }
      })
      .finally(() => {
        if (active) setAccountLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.id, revision]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function authenticated() {
    if (user) return true;
    setDialog({ type: "auth" });
    return false;
  }
  function verified() {
    if (!authenticated()) return false;
    if (!user.verified) {
      setError(
        "Verifica tu correo institucional antes de publicar, escribir o solicitar una operación.",
      );
      return false;
    }
    return true;
  }
  async function perform(action, message, { close = false } = {}) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = await action();
      setRevision((value) => value + 1);
      if (close) setDialog(null);
      if (message) setToast(message);
      return data;
    } catch (failure) {
      setError(failure.message);
      if (failure.status === 401) {
        setUser(null);
        setDialog({ type: "auth" });
      }
      return null;
    } finally {
      setBusy(false);
    }
  }
  function browse(updates = {}) {
    setView("Explorar");
    setFilters({ ...emptyFilters, ...updates });
    setDialog(null);
  }
  function navigate(next) {
    if (
      ["Favoritos", "Perfil", "Mensajes", "Operaciones", "Gestión"].includes(
        next,
      ) &&
      !authenticated()
    )
      return;
    if (next === "Gestión" && user?.role !== "admin") return;
    if (user) setRevision((value) => value + 1);
    setDialog(null);
    setError("");
    setView(next);
  }
  function publish(item) {
    if (verified()) setDialog({ type: "listing", item });
  }
  function filter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }
  const close = () => setDialog(null);
  async function openItem(id) {
    await perform(async () => {
      const data = await api.listing(id);
      setDialog({ type: "detail", item: data.item });
    });
  }
  async function favorite(id) {
    if (!authenticated()) return;
    await perform(() => api.favorite(id, !account.favorites.includes(id)));
  }
  async function saveListing(id, body) {
    await api.saveListing(id, body);
    setDialog(null);
    browse();
    setRevision((value) => value + 1);
    setToast("Publicación guardada.");
  }
  async function login(session) {
    setUser(session.user);
    setDialog(null);
    setRevision((value) => value + 1);
    setToast("Sesión iniciada.");
  }
  async function sellerProfile(id) {
    await perform(async () => {
      const response = await api.publicProfile(id);
      setDialog({ type: "seller", user: response.user });
    });
  }
  async function resend() {
    await perform(async () => {
      const response = await api.verification();
      if (!response.verificationSent)
        throw new Error(
          "El envío de correo aún no está configurado. Tu cuenta seguirá pendiente de verificación.",
        );
    }, "Revisa tu correo institucional.");
  }

  if (fatal)
    return (
      <main className="load-error">
        <h1>No pudimos abrir CampusTrade</h1>
        <p className="form-error" role="alert">
          {fatal}
        </p>
        <button
          className="button button-primary"
          onClick={() => {
            setFatal("");
            setBoot((value) => value + 1);
          }}
        >
          Reintentar conexión
        </button>
      </main>
    );
  if (!catalog)
    return (
      <main className="load-error">
        <h1>CampusTrade</h1>
        <p role="status">Conectando con tu comunidad…</p>
      </main>
    );
  const refresh = () => setRevision((value) => value + 1);
  const saved = (message) => {
    close();
    refresh();
    setToast(message);
  };
  const transition = (operation, status) =>
    setDialog({
      type: "confirm",
      title: "Confirmar operación",
      text: `Se cambiará la solicitud de ${operation.title} a ${statusLabels[status]}.`,
      action: () => api.transition(operation.id, status),
    });
  const cards = (items) => (
    <div className="product-grid">
      {items.map((item) => (
        <ProductCard
          key={item.id}
          item={decorateListing(item)}
          isFavorite={account.favorites.includes(item.id)}
          onFavorite={favorite}
          onOpen={openItem}
        />
      ))}
    </div>
  );
  const featured = result.items.find((item) => item.status === "available");

  return (
    <div className="app-shell" aria-busy={busy}>
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <header className="topbar">
        <button
          className="brand"
          aria-label="Ir a inicio"
          onClick={() => navigate("Inicio")}
        >
          <span className="brand-mark">ct</span>
          <span>
            Campus<span>Trade</span>
          </span>
        </button>
        <nav className="main-nav" aria-label="Navegación principal">
          {[
            ...nav,
            ...(user?.role === "admin" ? [["tool", "Gestión"]] : []),
          ].map(([icon, label]) => (
            <button
              key={label}
              className={view === label ? "active" : ""}
              aria-current={view === label ? "page" : undefined}
              onClick={() => navigate(label)}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </nav>
        {user ? (
          <button
            className="user-avatar"
            aria-label="Abrir mi perfil"
            onClick={() => navigate("Perfil")}
          >
            {initials(user.name)}
          </button>
        ) : (
          <button
            className="button button-secondary login-button"
            onClick={() => setDialog({ type: "auth" })}
          >
            Iniciar sesión
          </button>
        )}
      </header>
      {user && !user.verified && (
        <div className="verification-notice">
          <span>Tu correo institucional está pendiente de verificación.</span>
          <button className="text-link" disabled={busy} onClick={resend}>
            Reenviar enlace
          </button>
        </div>
      )}
      {error && !dialog && (
        <div className="global-error" role="alert">
          <span>{error}</span>
          <button className="text-link" onClick={() => setError("")}>
            Cerrar aviso
          </button>
        </div>
      )}
      <main id="contenido">
        {view === "Inicio" && (
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
                  Compra, renta, intercambia o dona materiales académicos con
                  estudiantes de tu comunidad.
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
                    onClick={() => publish()}
                  >
                    <Icon name="plus" size={18} />
                    Publicar artículo
                  </button>
                </div>
                <div className="trust-line">
                  <span>
                    <Icon name="check" size={15} />
                    Verificación por correo institucional
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
                  <ListingVisual
                    type={featured ? decorateListing(featured).image : "book"}
                    imageUrl={
                      featured?.images[0]
                        ? imageUrl(featured.images[0].url)
                        : ""
                    }
                    large
                  />
                  <div>
                    <span>
                      {featured?.title || "Dale otra vida a tus materiales"}
                    </span>
                    {featured && <strong>{money(featured.price)}</strong>}
                  </div>
                </div>
                <div className="hero-card hero-card-float">
                  <span className="avatar avatar-small">CT</span>
                  <div>
                    <strong>Tu comunidad universitaria</strong>
                    <small>Venta, renta, intercambio y donación</small>
                  </div>
                </div>
              </div>
            </section>
            <section className="category-section">
              <div className="section-title">
                <div>
                  <p className="eyebrow">Encuentra lo que buscas</p>
                  <h2>Explora por categoría</h2>
                </div>
                <button className="text-link" onClick={() => browse()}>
                  Ver todo
                </button>
              </div>
              <div className="category-grid">
                {catalog.categories.map((category, index) => (
                  <button
                    className="category-card"
                    key={category.id}
                    onClick={() => browse({ categoryId: category.id })}
                  >
                    <span className="category-icon">
                      <Icon
                        name={["chip", "flask", "book", "tool"][index % 4]}
                        size={25}
                      />
                    </span>
                    <strong>{category.name}</strong>
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
                  Ver catálogo
                </button>
              </div>
              {loading ? (
                <p role="status">Cargando artículos…</p>
              ) : result.items.length ? (
                cards(result.items.slice(0, 4))
              ) : (
                <EmptyState
                  title="El catálogo está listo para tu primera publicación"
                  text="Comparte un material que alguien más pueda aprovechar."
                  action={
                    <button
                      className="button button-primary"
                      onClick={() => publish()}
                    >
                      Publicar artículo
                    </button>
                  }
                />
              )}
            </section>
          </>
        )}
        {(view === "Explorar" || view === "Favoritos") && (
          <section className="explore-page">
            <div className="page-heading">
              <div>
                <p className="eyebrow">CampusTrade</p>
                <h1>
                  {view === "Favoritos"
                    ? "Tus favoritos"
                    : "Explora el catálogo"}
                </h1>
                <p>Encuentra materiales para tu siguiente proyecto.</p>
              </div>
              <button
                className="button button-primary"
                onClick={() => publish()}
              >
                <Icon name="plus" size={18} />
                Publicar
              </button>
            </div>
            {view === "Explorar" && (
              <>
                <div className="filter-bar">
                  <label className="search-field">
                    <Icon name="search" />
                    <input
                      aria-label="Buscar artículos"
                      placeholder="Buscar libros, herramientas, materiales…"
                      value={filters.q}
                      onChange={(event) => filter("q", event.target.value)}
                    />
                  </label>
                  <button
                    className="filter-button"
                    aria-label="Mostrar filtros"
                    aria-expanded={showFilters}
                    aria-controls="filtros"
                    onClick={() => setShowFilters((value) => !value)}
                  >
                    <Icon name="filter" />
                    Filtros
                  </button>
                </div>
                {showFilters && (
                  <div className="filter-panel" id="filtros">
                    <Filter
                      label="Carrera"
                      value={filters.career}
                      onChange={(value) => filter("career", value)}
                      options={catalog.careers.map((name) => [name, name])}
                    />
                    <Filter
                      label="Categoría"
                      value={filters.categoryId}
                      onChange={(value) => filter("categoryId", value)}
                      options={catalog.categories.map((category) => [
                        category.id,
                        category.name,
                      ])}
                    />
                    <Filter
                      label="Modalidad"
                      value={filters.modality}
                      onChange={(value) => filter("modality", value)}
                      options={Object.entries(modalityLabels)}
                    />
                    <Filter
                      label="Condición"
                      value={filters.condition}
                      onChange={(value) => filter("condition", value)}
                      options={Object.entries(conditionLabels)}
                    />
                    <Filter
                      label="Disponibilidad"
                      value={filters.status}
                      onChange={(value) => filter("status", value)}
                      options={Object.entries(statusLabels).filter(([key]) =>
                        [
                          "available",
                          "reserved",
                          "sold",
                          "rented",
                          "exchanged",
                          "donated",
                        ].includes(key),
                      )}
                      all="all"
                    />
                    <label className="filter-select">
                      Precio mínimo
                      <input
                        type="number"
                        min={0}
                        max={1000000}
                        step="0.01"
                        value={filters.minPrice}
                        onChange={(event) =>
                          filter("minPrice", event.target.value)
                        }
                      />
                    </label>
                    <label className="filter-select">
                      Precio máximo
                      <input
                        type="number"
                        min={0}
                        max={1000000}
                        step="0.01"
                        value={filters.maxPrice}
                        onChange={(event) =>
                          filter("maxPrice", event.target.value)
                        }
                      />
                    </label>
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
            {view === "Favoritos" ? (
              <FavoritesView
                user={user}
                revision={revision}
                renderCards={cards}
                onExplore={() => browse()}
              />
            ) : (
              <>
                <div className="result-bar" role="status">
                  <span>
                    {result.total}{" "}
                    {result.total === 1 ? "resultado" : "resultados"}
                  </span>
                  <span>Más recientes primero</span>
                </div>
                {loading ? (
                  <p role="status">Buscando artículos…</p>
                ) : result.items.length ? (
                  cards(result.items)
                ) : (
                  <EmptyState
                    title="No encontramos artículos"
                    text="Prueba otra búsqueda o limpia los filtros."
                    action={
                      <button
                        className="button button-primary"
                        onClick={() => setFilters({ ...emptyFilters })}
                      >
                        Limpiar búsqueda y filtros
                      </button>
                    }
                  />
                )}
                <Pager
                  page={result.page}
                  total={result.total}
                  limit={result.limit}
                  onChange={(page) =>
                    setFilters((current) => ({ ...current, page }))
                  }
                />
              </>
            )}
          </section>
        )}
        {view === "Perfil" && user && (
          <section className="profile-page">
            <div className="profile-cover" />
            <div className="profile-hero">
              <span className="profile-avatar">{initials(user.name)}</span>
              <div>
                <p className="eyebrow">
                  {user.verified
                    ? "Correo institucional verificado"
                    : "Verificación pendiente"}
                </p>
                <h1>{user.name}</h1>
                <p>
                  {user.career} · {user.semester}.º semestre
                </p>
              </div>
              <button
                className="button button-secondary"
                onClick={() => publish()}
              >
                <Icon name="plus" />
                Publicar artículo
              </button>
            </div>
            <div className="profile-grid">
              <section>
                <h2>Tu actividad</h2>
                <div className="stat-row">
                  <span>
                    <strong>{account.own.length}</strong>Publicaciones recientes
                  </span>
                  <span>
                    <strong>
                      {
                        account.operations.filter(
                          (operation) => operation.status === "completed",
                        ).length
                      }
                    </strong>
                    Operaciones finalizadas
                  </span>
                  <span>
                    <strong>
                      {account.profile?.ratingCount
                        ? account.profile.rating.toFixed(1)
                        : "—"}
                    </strong>
                    Reputación
                  </span>
                </div>
                <h2>Tus publicaciones</h2>
                {accountLoading ? (
                  <p role="status">Cargando tu actividad…</p>
                ) : account.own.length ? (
                  <ul className="owned-list">
                    {account.own.map((item) => (
                      <li key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <p>
                            {statusLabels[item.status]} ·{" "}
                            {modalityLabels[item.modality]} ·{" "}
                            {money(item.price)}
                          </p>
                        </div>
                        <div className="listing-actions">
                          <button
                            className="text-link"
                            disabled={item.status !== "available"}
                            onClick={() => publish(item)}
                          >
                            Editar
                          </button>
                          <button
                            className="text-link"
                            disabled={["reserved", "rented"].includes(
                              item.status,
                            )}
                            onClick={() => setDialog({ type: "delete", item })}
                          >
                            Retirar publicación
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aún no has publicado artículos.</p>
                )}
                <h2>Calificaciones recibidas</h2>
                {account.profile?.ratings.length ? (
                  <ul className="owned-list">
                    {account.profile.ratings.map((rating) => (
                      <li key={rating.id}>
                        <strong>
                          {rating.score}/5 · {rating.author}
                        </strong>
                        <p>{rating.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aún no tienes calificaciones.</p>
                )}
                <h2>Tus reportes</h2>
                {account.reports.length ? (
                  <ul className="owned-list">
                    {account.reports.map((report) => (
                      <li key={report.id}>
                        <strong>{report.title}</strong>
                        <p>
                          {report.status} · {report.detail}
                        </p>
                        {report.resolution && (
                          <p>Resolución: {report.resolution}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No has enviado reportes.</p>
                )}
              </section>
              <aside className="profile-info">
                <h2>Tu información</h2>
                <p>{user.email}</p>
                <p>Entrega acordada dentro del campus.</p>
                <button
                  className="text-link"
                  onClick={() => setDialog({ type: "profile" })}
                >
                  Editar perfil
                </button>
                <hr />
                <button
                  className="text-link"
                  disabled={busy}
                  onClick={() =>
                    perform(async () => {
                      await api.logout();
                      setUser(null);
                      setView("Inicio");
                    }, "Sesión cerrada.")
                  }
                >
                  Cerrar sesión
                </button>
              </aside>
            </div>
          </section>
        )}
        {view === "Mensajes" && user && (
          <Messenger
            user={user}
            threads={account.threads}
            initialId={messageThread}
            onExplore={() => browse()}
          />
        )}
        {view === "Operaciones" && user && (
          <OperationsPage
            items={account.operations}
            user={user}
            loading={accountLoading}
            onRefresh={refresh}
            onTransition={transition}
            onRate={(operation) => setDialog({ type: "rating", operation })}
            onReturn={(operation) =>
              setDialog({
                type: "confirm",
                title: "Registrar devolución",
                text: `Confirma que recibiste de vuelta ${operation.title} en las condiciones acordadas. El artículo volverá a estar disponible.`,
                action: () => api.returnRental(operation.id),
              })
            }
          />
        )}
        {view === "Gestión" && user?.role === "admin" && (
          <AdminPage
            revision={revision}
            onRefresh={refresh}
            onResolve={(report) => setDialog({ type: "resolution", report })}
            onCancel={(operation) => transition(operation, "cancelled")}
            onSuspend={(account) =>
              setDialog({
                type: "confirm",
                title: account.suspended
                  ? "Reactivar cuenta"
                  : "Suspender cuenta",
                text: `Se ${account.suspended ? "reactivará" : "suspenderá"} la cuenta de ${account.name}. Las reservas activas deben resolverse antes de suspender.`,
                action: () => api.suspend(account.id, !account.suspended),
              })
            }
            onModerate={(item) =>
              setDialog({
                type: "confirm",
                title: "Retirar por moderación",
                text: `Se retirará ${item.title} del catálogo conservando el historial.`,
                action: () => api.moderate(item.id),
              })
            }
            onCatalog={(entry) =>
              entry.item
                ? setDialog({
                    type: "confirm",
                    title: "Actualizar catálogo",
                    text: `Se ${entry.item.active ? "desactivará" : "activará"} ${entry.item.name}.`,
                    action: () =>
                      entry.kind === "category"
                        ? api.category(entry.item.id, !entry.item.active)
                        : api.career(entry.item.name, !entry.item.active),
                  })
                : setDialog({ type: "catalog", kind: entry.kind })
            }
          />
        )}
      </main>
      <footer>
        <span>CampusTrade</span>
        <span>Equipo 3 MEX-PER · Versión 0.3.0</span>
        <span>Reutiliza · Comparte · Conecta</span>
      </footer>
      {dialog?.type === "auth" && (
        <AuthDialog catalog={catalog} onClose={close} onLogin={login} />
      )}
      {dialog?.type === "token" && (
        <TokenDialog
          {...dialog}
          onClose={() => {
            window.history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search,
            );
            close();
          }}
          onComplete={async (message) => {
            window.history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search,
            );
            const session = await api.session();
            setUser(session.user);
            close();
            setToast(message);
          }}
        />
      )}
      {dialog?.type === "listing" && (
        <ListingDialog
          item={dialog.item}
          catalog={catalog}
          onClose={close}
          onSave={saveListing}
        />
      )}
      {dialog?.type === "profile" && (
        <ProfileDialog
          user={user}
          catalog={catalog}
          onClose={close}
          onSave={async (body) => {
            const result = await api.profile(body);
            setUser(result.user);
            close();
            setRevision((value) => value + 1);
            setToast("Perfil actualizado.");
          }}
        />
      )}
      {dialog?.type === "detail" && (
        <Detail
          item={dialog.item}
          user={user}
          favorite={account.favorites.includes(dialog.item.id)}
          error={error}
          onFavorite={() => favorite(dialog.item.id)}
          onClose={close}
          onSeller={() => sellerProfile(dialog.item.seller.id)}
          onMessage={() => {
            if (verified())
              perform(async () => {
                const result = await api.openConversation(dialog.item.id);
                setMessageThread(result.id);
                setView("Mensajes");
                close();
              });
          }}
          onOperation={() => {
            if (verified()) setDialog({ type: "operation", item: dialog.item });
          }}
          onReport={() => {
            if (authenticated())
              setDialog({ type: "report", item: dialog.item });
          }}
          onManage={() => {
            close();
            setView("Perfil");
          }}
        />
      )}
      {dialog?.type === "seller" && (
        <Modal title={dialog.user.name} onClose={close}>
          <p>
            {dialog.user.career} · {dialog.user.semester}.º semestre
          </p>
          <p>
            {dialog.user.verified
              ? "Correo institucional verificado"
              : "Verificación pendiente"}
          </p>
          <p>
            {dialog.user.ratingCount
              ? `${dialog.user.rating.toFixed(1)} de reputación · ${dialog.user.ratingCount} calificaciones`
              : "Aún sin calificaciones"}
          </p>
          <ul className="owned-list">
            {dialog.user.ratings.map((rating) => (
              <li key={rating.id}>
                <strong>
                  {rating.score}/5 · {rating.author}
                </strong>
                <p>{rating.comment}</p>
              </li>
            ))}
          </ul>
        </Modal>
      )}
      {dialog?.type === "report" && (
        <ReportDialog
          item={dialog.item}
          onClose={close}
          onSave={async (body) => {
            await api.report(body);
            close();
            setRevision((value) => value + 1);
            setToast("Reporte enviado a moderación.");
          }}
        />
      )}
      {dialog?.type === "delete" && (
        <ConfirmDialog
          title="Retirar publicación"
          text={`Se retirará ${dialog.item.title} del catálogo y se conservará su historial.`}
          onClose={close}
          onConfirm={async () => {
            await api.deleteListing(dialog.item.id);
            close();
            setRevision((value) => value + 1);
            setToast("Publicación retirada.");
          }}
        />
      )}
      {dialog?.type === "operation" && (
        <OperationDialog
          item={dialog.item}
          own={account.own}
          onClose={close}
          onSave={async (body) => {
            await api.createOperation(body);
            saved("Solicitud enviada.");
            setView("Operaciones");
          }}
        />
      )}
      {dialog?.type === "rating" && (
        <RatingDialog
          operation={dialog.operation}
          onClose={close}
          onSave={async (body) => {
            await api.rate(dialog.operation.id, body);
            saved("Calificación guardada.");
          }}
        />
      )}
      {dialog?.type === "resolution" && (
        <ResolutionDialog
          report={dialog.report}
          onClose={close}
          onSave={async (body) => {
            await api.resolve(dialog.report.id, body);
            saved("Resolución guardada.");
          }}
        />
      )}
      {dialog?.type === "catalog" && (
        <CatalogDialog
          kind={dialog.kind}
          onClose={close}
          onSave={async (name) => {
            await (dialog.kind === "category"
              ? api.addCategory(name)
              : api.addCareer(name));
            setCatalog(await api.catalog());
            saved("Catálogo actualizado.");
          }}
        />
      )}
      {dialog?.type === "confirm" && (
        <ConfirmDialog
          title={dialog.title}
          text={dialog.text}
          onClose={close}
          onConfirm={async () => {
            await dialog.action();
            setCatalog(await api.catalog());
            saved("Cambio guardado.");
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" />
          {toast}
        </div>
      )}
    </div>
  );
}

function Filter({ label, options, value, onChange, all = "" }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value={all}>Todas las opciones</option>
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Pager({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit);
  return (
    pages > 1 && (
      <nav className="pagination" aria-label="Paginación">
        <button
          className="button button-secondary"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Anterior
        </button>
        <span>
          Página {page} de {pages}
        </span>
        <button
          className="button button-secondary"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Siguiente
        </button>
      </nav>
    )
  );
}
function FavoritesView({ user, revision, renderCards, onExplore }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .favorites({ page, limit: 12 })
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
        }
      })
      .catch((failure) => {
        if (active) setError(failure.message);
      });
    return () => {
      active = false;
    };
  }, [user.id, page, revision]);
  if (error)
    return (
      <p className="form-error" role="alert">
        {error}
      </p>
    );
  if (!data) return <p role="status">Cargando favoritos…</p>;
  return data.items.length ? (
    <>
      {renderCards(data.items)}
      <Pager {...data} onChange={setPage} />
    </>
  ) : (
    <EmptyState
      title="Aún no hay favoritos"
      text="Guarda los artículos que quieras revisar después."
      action={
        <button className="button button-primary" onClick={onExplore}>
          Explorar artículos
        </button>
      }
    />
  );
}
function Detail({
  item,
  user,
  favorite,
  error,
  onFavorite,
  onClose,
  onSeller,
  onReport,
  onManage,
  onMessage,
  onOperation,
}) {
  const own = item.seller.id === user?.id;
  const image = item.images[0];
  return (
    <Modal
      title={item.title}
      onClose={onClose}
      className="publish-modal product-detail"
    >
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <ListingVisual
        type={decorateListing(item).image}
        imageUrl={image ? imageUrl(image.url) : ""}
        title={item.title}
        large
      />
      {item.images.length > 1 && (
        <div className="detail-images">
          {item.images.slice(1).map((image) => (
            <img key={image.id} src={imageUrl(image.url)} alt={item.title} />
          ))}
        </div>
      )}
      <div className="detail-topline">
        <Badge modality={modalityLabels[item.modality]} />
        <button
          className={`icon-button favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Icon name="heart" />
        </button>
      </div>
      <p className="eyebrow">
        {item.career} · {item.category}
      </p>
      <p className="detail-price">
        {item.modality === "donation"
          ? "Gratis"
          : item.modality === "exchange"
            ? "Propón un intercambio"
            : `${money(item.price)}${item.modality === "rental" ? " por día" : ""}`}
      </p>
      <p className="detail-description">{item.description}</p>
      <div className="detail-facts">
        <span>
          <b>Condición</b>
          {conditionLabels[item.condition]}
        </span>
        <span>
          <b>Entrega</b>
          {item.location}
        </span>
        <span>
          <b>Estado</b>
          {statusLabels[item.status]}
        </span>
      </div>
      <div className="seller-detail">
        <span className="avatar">{initials(item.seller.name)}</span>
        <div>
          <strong>{item.seller.name}</strong>
          <small>
            {item.seller.verified
              ? "Correo verificado"
              : "Pendiente de verificación"}
            {item.seller.ratingCount
              ? ` · ${item.seller.rating.toFixed(1)} / 5`
              : " · Sin calificaciones"}
          </small>
        </div>
        <button className="text-link" onClick={onSeller}>
          Ver perfil
        </button>
      </div>
      {own ? (
        <button className="button button-primary" onClick={onManage}>
          Administrar en mi perfil
        </button>
      ) : (
        <>
          {onMessage && (
            <button
              className="button button-secondary"
              disabled={item.status !== "available"}
              onClick={onMessage}
            >
              Abrir conversación
            </button>
          )}
          {onOperation && (
            <button
              className="button button-primary"
              disabled={item.status !== "available"}
              onClick={onOperation}
            >
              Solicitar artículo
            </button>
          )}
          <button className="text-link report-link" onClick={onReport}>
            Reportar publicación
          </button>
        </>
      )}
    </Modal>
  );
}
