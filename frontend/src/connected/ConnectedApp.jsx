import { MinimalHeader } from "../components/MinimalHeader.jsx";
import { MailDeliveryNotice } from "../components/MailDeliveryNotice.jsx";
import {
  CategoryTabs,
  FilterChips,
  CatalogFilters,
  CatalogSkeleton,
} from "./CatalogControls.jsx";
import { Detail } from "./ListingDetail.jsx";
import { useReadMarkers } from "./useReadMarkers.js";
import { HomeHero } from "../components/HomeHero.jsx";
import { useCallback, useEffect, useState } from "react";
import {
  api,
  decorateListing,
  initials,
  modalityLabels,
  statusLabels,
  money,
} from "../services/apiClient.js";
import { Icon } from "../components/Visuals.jsx";
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
import {
  emptyFilters,
  invalidPriceRange,
  readNavigation,
} from "../domain/catalogNavigation.js";
import { useCatalogNavigation } from "./useCatalogNavigation.js";
const emptyAccount = {
  own: [],
  favorites: [],
  reports: [],
  threads: [],
  operations: [],
  profile: null,
};
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
  const { view, filters, setView, setFilters } = useCatalogNavigation();
  const priceError = invalidPriceRange(filters);
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
  const [showFilters, setShowFilters] = useState(() =>
    invalidPriceRange(readNavigation(window.location.search).filters),
  );
  const [messageThread, setMessageThread] = useState(null);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [profileTarget, setProfileTarget] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [mailDelivery, setMailDelivery] = useState({});
  const demoMail = mailDelivery.emailDeliveryMode === "local_demo";
  const { unread, onRead } = useReadMarkers(user?.id, account.threads);
  const syncThreads = useCallback(
    (threads) => setAccount((current) => ({ ...current, threads })),
    [],
  );
  useEffect(() => {
    if (view === "Perfil" && profileTarget?.id)
      document
        .getElementById(profileTarget.id)
        ?.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [view, profileTarget]);
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
          setEmailAvailable(Boolean(session.emailDeliveryConfigured));
          setMailDelivery({
            emailDeliveryMode: session.emailDeliveryMode,
            localMailboxUrl: session.localMailboxUrl,
          });
          setFatal("");
          if (
            !session.user &&
            [
              "Favoritos",
              "Perfil",
              "Mensajes",
              "Operaciones",
              "Gestión",
            ].includes(view)
          ) {
            setView("Inicio");
            setDialog((current) =>
              current?.type === "token" ? current : { type: "auth" },
            );
          } else if (view === "Gestión" && session.user?.role !== "admin")
            setView("Inicio");
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
    if (priceError) {
      setLoading(false);
      return;
    }
    const abort = new AbortController();
    setLoading(true);
    api
      .listings(filters, abort.signal)
      .then((data) => {
        setResult(data);
        setError("");
      })
      .catch((failure) => {
        if (!abort.signal.aborted && failure.name !== "AbortError")
          setError(failure.message);
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [catalog, filters, revision, priceError]);
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
    setConversationOpen(false);
    setMessageThread(null);
    setShowFilters(false);
    setView("Explorar");
    setFilters({ ...emptyFilters, ...updates });
    setDialog(null);
  }
  function navigate(next, section = "") {
    if (
      ["Favoritos", "Perfil", "Mensajes", "Operaciones", "Gestión"].includes(
        next,
      ) &&
      !authenticated()
    )
      return;
    if (next === "Gestión" && user?.role !== "admin") return;
    if (next === "Inicio") setFilters({ ...emptyFilters });
    setProfileTarget({ id: section });
    setConversationOpen(false);
    setMessageThread(null);
    setShowFilters(false);
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
  async function logout() {
    await perform(async () => {
      await api.logout();
      setUser(null);
      setView("Inicio");
      setConversationOpen(false);
      setFilters({ ...emptyFilters });
    }, "Sesión cerrada.");
  }
  async function resend() {
    await perform(
      async () => {
        const response = await api.verification();
        if (!response.verificationSent)
          throw new Error(
            demoMail
              ? "No se pudo entregar el enlace al buzón local. Comprueba que el servicio de correo de pruebas esté iniciado."
              : "No se pudo enviar el enlace. Revisa la configuración de correo; tu cuenta seguirá pendiente de verificación.",
          );
      },
      demoMail
        ? "Revisa el buzón local de pruebas."
        : "Revisa tu correo institucional.",
    );
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

  return (
    <div
      className={`app-shell minimal-shell ${dialog?.type === "detail" ? "has-detail" : ""} ${conversationOpen && view === "Mensajes" ? "has-conversation" : ""}`}
      aria-busy={busy}
    >
      <a className="skip-link" href="#contenido">
        Ir al contenido
      </a>
      <MinimalHeader
        user={user ? { ...user, initials: initials(user.name) } : null}
        view={view}
        query={filters.q}
        unread={unread}
        onSearch={(q) =>
          browse(view === "Explorar" ? { ...filters, q, page: 1 } : { q })
        }
        onNavigate={navigate}
        onPublish={() => publish()}
        onLogout={logout}
        onAuth={(mode) => setDialog({ type: "auth", mode })}
        compact={
          dialog?.type === "detail" || (conversationOpen && view === "Mensajes")
        }
      />
      <MailDeliveryNotice
        demoMail={demoMail}
        mailboxUrl={mailDelivery.localMailboxUrl}
      />
      {user && !user.verified && (
        <div className="verification-notice">
          <span>Tu correo institucional está pendiente de verificación.</span>
          <button
            className="text-link"
            disabled={busy || !emailAvailable}
            onClick={resend}
          >
            Reenviar enlace
          </button>
          {!emailAvailable && (
            <span>El envío de verificación aún no está disponible.</span>
          )}
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
            <HomeHero actions={false} />
            <section
              className="catalog-section home-catalog"
              aria-label="Catálogo del campus"
            >
              <CategoryTabs
                categories={catalog.categories}
                value={filters.categoryId}
                onChange={(categoryId) =>
                  setFilters((current) => ({ ...current, categoryId, page: 1 }))
                }
              />
              <div className="section-title">
                <h2>Recién publicados</h2>
                <button
                  className="text-link"
                  onClick={() => browse({ ...filters, page: 1 })}
                >
                  Ver catálogo
                </button>
              </div>
              {loading ? (
                <CatalogSkeleton />
              ) : result.items.length ? (
                cards(result.items.slice(0, 8))
              ) : (
                <EmptyState
                  title="Aún no hay publicaciones"
                  text="Comparte un material que alguien más pueda aprovechar."
                  action={
                    <button
                      className="button button-secondary"
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
              <h1>
                {view === "Favoritos" ? "Tus favoritos" : "Explora el catálogo"}
              </h1>
              {view === "Explorar" && (
                <div className="catalog-tools">
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
                  <span className="sort-label">Más recientes</span>
                  <FilterChips
                    filters={filters}
                    catalog={catalog}
                    onRemove={(key) => filter(key, emptyFilters[key])}
                  />
                </div>
              )}
            </div>
            {view === "Explorar" && (
              <CategoryTabs
                categories={catalog.categories}
                value={filters.categoryId}
                onChange={(value) => filter("categoryId", value)}
              />
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
                {!priceError && (
                  <div className="result-bar" role="status">
                    <span>
                      {result.total}{" "}
                      {result.total === 1 ? "resultado" : "resultados"}
                    </span>
                  </div>
                )}
                {priceError ? (
                  !showFilters && (
                    <p className="field-error" role="alert">
                      El precio mínimo no puede ser mayor que el máximo. Abre
                      los filtros para corregirlo.
                    </p>
                  )
                ) : loading ? (
                  <CatalogSkeleton />
                ) : result.items.length ? (
                  cards(result.items)
                ) : (
                  <EmptyState
                    title="No encontramos artículos"
                    text="Prueba otra búsqueda o limpia los filtros."
                    action={
                      <button
                        className="button button-secondary"
                        onClick={() => setFilters({ ...emptyFilters })}
                      >
                        Limpiar búsqueda y filtros
                      </button>
                    }
                  />
                )}
                {!priceError && (
                  <Pager
                    page={result.page}
                    total={result.total}
                    limit={result.limit}
                    onChange={(page) =>
                      setFilters((current) => ({ ...current, page }))
                    }
                  />
                )}
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
                    ? demoMail
                      ? "Verificación de demostración completada"
                      : "Correo institucional verificado"
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
            <nav className="profile-links" aria-label="Secciones de mi cuenta">
              <button onClick={() => navigate("Perfil", "mis-publicaciones")}>
                Mis publicaciones
                <Icon name="arrow" />
              </button>
              <button onClick={() => navigate("Favoritos")}>
                Favoritos
                <Icon name="arrow" />
              </button>
              <button onClick={() => navigate("Operaciones")}>
                Operaciones
                <Icon name="arrow" />
              </button>
              <button onClick={() => navigate("Perfil", "verificacion-cuenta")}>
                Verificación de cuenta
                <Icon name="arrow" />
              </button>
              {user.role === "admin" && (
                <button onClick={() => navigate("Gestión")}>
                  Gestión
                  <Icon name="arrow" />
                </button>
              )}
            </nav>
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
                <h2 id="mis-publicaciones">Tus publicaciones</h2>
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
              <aside className="profile-info" id="verificacion-cuenta">
                <h2>Tu información</h2>
                <p>{user.email}</p>
                <p>
                  {user.verified
                    ? demoMail
                      ? "Verificación de demostración completada"
                      : "Correo institucional verificado"
                    : "Tu cuenta sigue pendiente de verificación."}
                </p>
                <p>Entrega acordada dentro del campus.</p>
                <button
                  className="text-link"
                  onClick={() => setDialog({ type: "profile" })}
                >
                  Editar perfil
                </button>
                <hr />
                <button className="text-link" disabled={busy} onClick={logout}>
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
            onConversationChange={setConversationOpen}
            onThreads={syncThreads}
            onRead={onRead}
            onListing={openItem}
            onOperations={() => navigate("Operaciones")}
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
            demoMail={demoMail}
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
      {view === "Explorar" && showFilters && (
        <CatalogFilters
          catalog={catalog}
          filters={filters}
          priceError={priceError}
          onChange={filter}
          onReset={() => setFilters({ ...emptyFilters })}
          onClose={() => setShowFilters(false)}
        />
      )}
      {dialog?.type === "auth" && (
        <AuthDialog
          key={dialog.mode || "login"}
          initialMode={dialog.mode || "login"}
          demoMail={demoMail}
          mailboxUrl={mailDelivery.localMailboxUrl}
          catalog={catalog}
          onClose={close}
          onLogin={login}
        />
      )}
      {dialog?.type === "token" && (
        <TokenDialog
          demoMail={demoMail}
          mailboxUrl={mailDelivery.localMailboxUrl}
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
          demoMail={demoMail}
          item={dialog.item}
          user={user}
          favorite={account.favorites.includes(dialog.item.id)}
          error={error}
          onExplore={() => browse({ categoryId: dialog.item.categoryId })}
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
              ? demoMail
                ? "Verificación de demostración completada"
                : "Correo institucional verificado"
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
