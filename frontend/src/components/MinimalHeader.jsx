import { useEffect, useRef, useState } from "react";
import { Icon } from "./Visuals.jsx";

export function MinimalHeader({
  user,
  view,
  query,
  onSearch,
  onNavigate,
  onPublish,
  onAuth,
  onLogout,
  unread,
  compact = false,
}) {
  const [draft, setDraft] = useState(query);
  const [open, setOpen] = useState(false);
  const account = useRef(null);
  const avatar = useRef(null);
  const menu = useRef(null);
  useEffect(() => setDraft(query), [query]);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector("button")?.focus();
    const outside = (event) => {
      if (!account.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        avatar.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  function choose(action) {
    setOpen(false);
    avatar.current?.focus();
    action();
  }
  const entries = [
    ["Mi perfil", () => onNavigate("Perfil")],
    ["Mis publicaciones", () => onNavigate("Perfil", "mis-publicaciones")],
    ["Favoritos", () => onNavigate("Favoritos")],
    ["Operaciones", () => onNavigate("Operaciones")],
    [
      "Verificación de cuenta",
      () => onNavigate("Perfil", "verificacion-cuenta"),
    ],
    ...(user?.role === "admin"
      ? [["Gestión", () => onNavigate("Gestión")]]
      : []),
    ["Cerrar sesión", onLogout],
  ];
  return (
    <>
      <header className="topbar">
        <button
          className="brand"
          aria-label="Ir a inicio"
          onClick={() => onNavigate("Inicio")}
        >
          CampusTrade
        </button>
        <form
          className="header-search"
          role="search"
          aria-label="Búsqueda del campus"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(draft);
          }}
        >
          <input
            aria-label="Buscar en el campus"
            placeholder="Buscar en el campus"
            value={draft}
            maxLength={100}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <Icon name="search" />
          </button>
        </form>
        <div className="header-actions">
          <button
            className="text-link header-publish"
            aria-label="Publicar artículo"
            onClick={onPublish}
          >
            Publicar
          </button>
          {user ? (
            <>
              <button
                className={`header-messages ${view === "Mensajes" ? "active" : ""}`}
                aria-label="Mensajes"
                title={unread ? "Mensajes nuevos" : "Mensajes"}
                onClick={() => onNavigate("Mensajes")}
              >
                Mensajes
                {unread && <i className="unread-dot" aria-hidden="true" />}
              </button>
              <button
                className={`icon-button header-favorites ${view === "Favoritos" ? "active" : ""}`}
                aria-label="Favoritos"
                onClick={() => onNavigate("Favoritos")}
              >
                <Icon name="heart" />
              </button>
              <div className="account-control" ref={account}>
                <button
                  ref={avatar}
                  className="user-avatar"
                  aria-label="Abrir mi perfil"
                  title="Menú de cuenta"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  aria-controls="menu-cuenta"
                  onClick={() => setOpen((value) => !value)}
                >
                  {user.initials}
                </button>
                {open && (
                  <div
                    className="account-menu"
                    role="menu"
                    aria-label="Cuenta"
                    id="menu-cuenta"
                    ref={menu}
                    onKeyDown={(event) => {
                      if (
                        ![
                          "ArrowDown",
                          "ArrowUp",
                          "Home",
                          "End",
                          "Tab",
                        ].includes(event.key)
                      )
                        return;
                      if (event.key === "Tab") {
                        setOpen(false);
                        avatar.current?.focus();
                        return;
                      }
                      event.preventDefault();
                      const buttons = [
                        ...menu.current.querySelectorAll("button"),
                      ];
                      const index = buttons.indexOf(document.activeElement);
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? buttons.length - 1
                            : (index +
                                (event.key === "ArrowDown" ? 1 : -1) +
                                buttons.length) %
                              buttons.length;
                      buttons[next]?.focus();
                    }}
                  >
                    {entries.map(([label, action]) => (
                      <button
                        key={label}
                        role="menuitem"
                        aria-current={
                          {
                            "Mi perfil": "Perfil",
                            Favoritos: "Favoritos",
                            Operaciones: "Operaciones",
                            Gestión: "Gestión",
                          }[label] === view
                            ? "page"
                            : undefined
                        }
                        onClick={() => choose(action)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="text-link login-button desktop-auth"
                onClick={() => onAuth("login")}
              >
                Iniciar sesión
              </button>
              <button
                className="button button-primary desktop-auth"
                onClick={() => onAuth("register")}
              >
                Crear cuenta
              </button>
              <button
                className="user-avatar mobile-auth"
                aria-label="Iniciar sesión"
                onClick={() => onAuth("login")}
              >
                <Icon name="user" />
              </button>
            </>
          )}
        </div>
      </header>
      <nav
        className={`main-nav mobile-nav ${compact ? "is-concealed" : ""}`}
        aria-label="Navegación principal"
      >
        {[
          ["home", "Inicio"],
          ["search", "Explorar"],
          ["plus", "Publicar"],
          ["message", "Mensajes"],
          ["user", "Perfil"],
        ].map(([icon, label]) => {
          const active =
            label === view ||
            (label === "Perfil" &&
              ["Favoritos", "Operaciones", "Gestión"].includes(view));
          return (
            <button
              key={label}
              className={`${active ? "active" : ""} ${label === "Publicar" ? "nav-publish" : ""}`}
              aria-label={label === "Publicar" ? "Publicar artículo" : label}
              aria-current={active ? "page" : undefined}
              onClick={() =>
                label === "Publicar" ? onPublish() : onNavigate(label)
              }
            >
              <Icon name={icon} />
              <span className="nav-label">{label}</span>
              {label === "Mensajes" && unread && (
                <i className="unread-dot" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
