import { useEffect, useRef, useState } from "react";
import { api, initials } from "../services/apiClient.js";
import { Icon } from "../components/Visuals.jsx";
import { EmptyState } from "../components/Catalog.jsx";

export function Messenger({ user, threads, initialId, onExplore }) {
  const [items, setItems] = useState(threads);
  const [selected, setSelected] = useState(initialId);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const end = useRef(null);
  const active =
    items.find((item) => item.id === selected) ||
    items.find((item) => item.id === initialId) ||
    items[0];
  const currentId = useRef(active?.id);
  currentId.current = active?.id;
  useEffect(() => setItems(threads), [threads]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await api.conversations();
        if (mounted) {
          setItems(result.items);
          setLoading(false);
        }
      } catch (failure) {
        if (mounted) {
          setError(failure.message);
          setLoading(false);
        }
      }
    }
    load();
    const timer = window.setInterval(load, 10000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [user.id]);
  useEffect(() => {
    setBody("");
    setPage(1);
    setError("");
  }, [active?.id]);
  useEffect(() => {
    if (!active) return;
    let mounted = true;
    setLoading(true);
    async function load() {
      try {
        const result = await api.messages(active.id, page);
        if (mounted) {
          setHistory(result);
          setError("");
          setLoading(false);
        }
      } catch (failure) {
        if (mounted) {
          setError(failure.message);
          setLoading(false);
        }
      }
    }
    load();
    const timer = page === 1 ? window.setInterval(load, 10000) : null;
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [active?.id, page]);
  useEffect(() => {
    if (page === 1) end.current?.scrollIntoView?.({ block: "nearest" });
  }, [history.items.length, active?.id, page]);
  async function send(event) {
    event.preventDefault();
    if (!body.trim() || !active || busy) return;
    const id = active.id;
    setBusy(true);
    try {
      await api.sendMessage(id, body);
      if (currentId.current === id) {
        setBody("");
        setPage(1);
        setHistory(await api.messages(id));
        setError("");
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  const visible = items.filter((item) =>
    `${item.name} ${item.title}`
      .toLocaleLowerCase("es")
      .includes(query.toLocaleLowerCase("es")),
  );
  return (
    <section className="messages-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Tu comunidad</p>
          <h1>Mensajes</h1>
          <p>Acuerda condiciones y entrega dentro del campus.</p>
        </div>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!active ? (
        loading ? (
          <p role="status">Cargando conversaciones…</p>
        ) : (
          <EmptyState
            title="Aún no tienes conversaciones"
            text="Abre un artículo para contactar a su propietario."
            action={
              <button className="button button-primary" onClick={onExplore}>
                Explorar artículos
              </button>
            }
          />
        )
      ) : (
        <div className="messages-layout">
          <aside className="thread-list">
            <label className="thread-search">
              <Icon name="search" />
              <input
                aria-label="Buscar conversación"
                placeholder="Buscar conversación"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            {visible.map((item) => (
              <button
                key={item.id}
                className={`thread ${item.id === active.id ? "active" : ""}`}
                aria-pressed={item.id === active.id}
                onClick={() => setSelected(item.id)}
              >
                <span className="avatar">{initials(item.name)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.lastMessage || item.title}</small>
                </span>
              </button>
            ))}
            {!visible.length && <p>No hay coincidencias.</p>}
          </aside>
          <section
            className="conversation"
            aria-label={`Conversación con ${active.name}`}
          >
            <header>
              <span className="avatar">{initials(active.name)}</span>
              <div>
                <strong>{active.name}</strong>
                <small>{active.title}</small>
              </div>
            </header>
            <div
              className="chat-body"
              role="log"
              aria-label="Historial de mensajes"
              aria-live="polite"
            >
              {loading ? (
                <p role="status">Cargando mensajes…</p>
              ) : history.items.length ? (
                history.items.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-bubble ${message.senderId === user.id ? "sent" : "received"}`}
                  >
                    {message.body}
                    <small>
                      {new Date(message.sentAt).toLocaleString("es-MX", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </small>
                  </div>
                ))
              ) : (
                <p className="chat-system">
                  Escribe el primer mensaje sobre este artículo.
                </p>
              )}
              <div ref={end} />
            </div>
            {history.total > 50 && (
              <div className="history-controls">
                <button
                  className="text-link"
                  disabled={page * 50 >= history.total}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Mensajes anteriores
                </button>
                <button
                  className="text-link"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  Más recientes
                </button>
              </div>
            )}
            <form className="message-composer" onSubmit={send}>
              <input
                aria-label="Mensaje"
                placeholder="Escribe un mensaje…"
                maxLength={2000}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={!user.verified}
              />
              <button
                className="send-button"
                aria-label="Enviar mensaje"
                disabled={busy || !body.trim() || !user.verified}
              >
                <Icon name="send" />
              </button>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
