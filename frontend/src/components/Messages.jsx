import { useEffect, useRef, useState } from "react";
import { Icon } from "./Visuals.jsx";
import { EmptyState } from "./Catalog.jsx";

export function Messages({ threads, activeId, onThread, onSend, onExplore }) {
  const [query, setQuery] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const end = useRef(null);
  const thread = threads.find((item) => item.id === activeId) || threads[0];
  const filtered = threads.filter((item) =>
    `${item.name} ${item.title}`
      .toLocaleLowerCase("es")
      .includes(query.toLocaleLowerCase("es")),
  );
  useEffect(() => {
    setBody("");
    setError("");
  }, [thread?.id]);
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: "nearest" });
  }, [thread?.id, thread?.messages.length]);
  function submit(event) {
    event.preventDefault();
    try {
      onSend(thread.id, body);
      setBody("");
      setError("");
    } catch (failure) {
      setError(failure.message);
    }
  }
  return (
    <section className="messages-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Conversaciones</p>
          <h1>Mensajes</h1>
          <p>Historial local. Los mensajes no se entregan a otras personas.</p>
        </div>
      </div>
      {!thread ? (
        <EmptyState
          title="Aún no tienes conversaciones"
          text="Abre un artículo y selecciona Abrir conversación para comenzar."
          action={
            <button className="button button-primary" onClick={onExplore}>
              Explorar artículos
            </button>
          }
        />
      ) : (
        <div className="messages-layout">
          <aside className="thread-list">
            <label className="thread-search">
              <Icon name="search" size={18} />
              <input
                aria-label="Buscar conversación"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar conversación"
              />
            </label>
            {!filtered.length && <p>No hay coincidencias.</p>}
            {filtered.map((item) => (
              <button
                className={`thread ${item.id === thread.id ? "active" : ""}`}
                key={item.id}
                aria-pressed={item.id === thread.id}
                onClick={() => onThread(item.id)}
              >
                <span className="avatar">{item.initials}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.messages.at(-1)?.body || item.title}</small>
                </span>
              </button>
            ))}
          </aside>
          <section
            className="conversation"
            aria-label={`Conversación con ${thread.name}`}
          >
            <header>
              <span className="avatar">{thread.initials}</span>
              <div>
                <strong>{thread.name}</strong>
                <small>{thread.title}</small>
              </div>
            </header>
            <div
              className="chat-body"
              role="log"
              aria-label="Historial de mensajes"
              aria-live="polite"
            >
              {!thread.messages.length && (
                <p className="chat-system">
                  Escribe el primer mensaje sobre este artículo.
                </p>
              )}
              {thread.messages.map((message) => (
                <div className="chat-bubble sent" key={message.id}>
                  {message.body}
                  <small>
                    {new Date(message.sentAt).toLocaleString("es-MX", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                </div>
              ))}
              <div ref={end} />
            </div>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <form className="message-composer" onSubmit={submit}>
              <input
                aria-label="Mensaje"
                value={body}
                maxLength={2000}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Escribe un mensaje…"
              />
              <button
                className="send-button"
                aria-label="Enviar mensaje"
                disabled={!body.trim()}
              >
                <Icon name="send" size={18} />
              </button>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
