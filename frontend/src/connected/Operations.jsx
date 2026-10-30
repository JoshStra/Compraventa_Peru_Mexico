import { useState } from "react";
import { Modal } from "../components/Modal.jsx";
import { Icon } from "../components/Visuals.jsx";
import { EmptyState } from "../components/Catalog.jsx";
import { Field } from "./Forms.jsx";
import { modalityLabels, statusLabels, money } from "../services/apiClient.js";

export function OperationDialog({ item, own, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const offers = own.filter(
    (entry) =>
      entry.status === "available" &&
      entry.modality === "exchange" &&
      entry.id !== item.id,
  );
  async function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try {
      await onSave({ listingId: item.id, ...fields });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Solicitar artículo"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p>
        <strong>{item.title}</strong>
      </p>
      <p>
        {modalityLabels[item.modality]} ·{" "}
        {item.modality === "exchange"
          ? "Propón otro artículo"
          : item.modality === "donation"
            ? "Gratis"
            : money(item.price) +
              (item.modality === "rental" ? " por día" : "")}
      </p>
      <p className="form-intro">
        La solicitud no reserva el artículo hasta que su propietario la acepte.
        Acuerden la entrega presencial por mensaje.
      </p>
      <form className="remote-form" onSubmit={submit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {item.modality === "rental" && (
          <>
            <Field label="Inicio de renta">
              <input name="rentalStart" type="date" required />
            </Field>
            <Field label="Fin de renta">
              <input name="rentalEnd" type="date" required />
            </Field>
            <p className="form-intro">
              De 1 a 90 días, contando ambos días. La API confirma el importe.
            </p>
          </>
        )}
        {item.modality === "exchange" && (
          <>
            <Field label="Artículo que ofreces">
              <select name="offeredListingId" required defaultValue="">
                <option value="" disabled>
                  Selecciona una publicación
                </option>
                {offers.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.title}
                  </option>
                ))}
              </select>
            </Field>
            {!offers.length && (
              <p className="form-intro">
                Primero publica un artículo disponible en modalidad Intercambio.
              </p>
            )}
          </>
        )}
        <button
          className="button button-primary"
          disabled={busy || (item.modality === "exchange" && !offers.length)}
        >
          {busy ? "Enviando…" : "Enviar solicitud"}
        </button>
      </form>
    </Modal>
  );
}

export function RatingDialog({ operation, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try {
      await onSave({ score: Number(values.score), comment: values.comment });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Califica la operación"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p>{operation.title}</p>
      <form className="remote-form" onSubmit={submit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Field label="Calificación">
          <select name="score" defaultValue="5">
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "estrella" : "estrellas"}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Comentario">
          <textarea
            name="comment"
            required
            minLength={5}
            maxLength={1000}
            rows={4}
          />
        </Field>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar calificación"}
        </button>
      </form>
    </Modal>
  );
}

export function OperationsPage({
  items,
  user,
  loading,
  onRefresh,
  onTransition,
  onRate,
  onReturn,
}) {
  return (
    <section className="operations-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Acuerdos entre estudiantes</p>
          <h1>Operaciones</h1>
          <p>Consulta tus solicitudes y las de tus publicaciones.</p>
        </div>
        <button
          className="button button-secondary refresh-button"
          aria-label="Actualizar operaciones"
          onClick={onRefresh}
        >
          <Icon name="arrow" />
          Actualizar
        </button>
      </div>
      {loading ? (
        <p role="status">Cargando operaciones…</p>
      ) : !items.length ? (
        <EmptyState
          title="Aún no tienes operaciones"
          text="Solicita un artículo del catálogo para comenzar."
        />
      ) : (
        <div className="operation-list">
          {items.map((operation) => {
            const owner = operation.sellerId === user.id;
            return (
              <article
                className="operation-card"
                key={operation.id}
                aria-label={`Operación de ${operation.title}`}
              >
                <div className="operation-summary">
                  <div>
                    <p className="eyebrow">{modalityLabels[operation.type]}</p>
                    <h2>{operation.title}</h2>
                    <p>
                      {owner
                        ? `Solicita: ${operation.requesterName}`
                        : `Propietario: ${operation.sellerName}`}
                    </p>
                  </div>
                  <span className={`state-tag state-${operation.status}`}>
                    {statusLabels[operation.status]}
                  </span>
                </div>
                {operation.offeredTitle && (
                  <p>Artículo ofrecido: {operation.offeredTitle}</p>
                )}
                {operation.rentalStart && (
                  <p>
                    Renta: {String(operation.rentalStart).slice(0, 10)} al{" "}
                    {String(operation.rentalEnd).slice(0, 10)}
                  </p>
                )}
                <p>
                  {["sale", "rental"].includes(operation.type)
                    ? `Importe acordado: ${money(operation.amount)} MXN`
                    : ["donation"].includes(operation.type)
                      ? "Donación sin costo"
                      : "Intercambio de materiales"}
                </p>
                <div className="operation-actions">
                  {operation.status === "pending" && owner && (
                    <>
                      <button
                        className="button button-primary"
                        onClick={() => onTransition(operation, "accepted")}
                      >
                        Aceptar solicitud
                      </button>
                      <button
                        className="button button-secondary"
                        onClick={() => onTransition(operation, "rejected")}
                      >
                        Rechazar solicitud
                      </button>
                    </>
                  )}
                  {operation.status === "accepted" && owner && (
                    <button
                      className="button button-primary"
                      onClick={() => onTransition(operation, "completed")}
                    >
                      Finalizar operación
                    </button>
                  )}
                  {["pending", "accepted"].includes(operation.status) && (
                    <button
                      className="text-link"
                      onClick={() => onTransition(operation, "cancelled")}
                    >
                      Cancelar solicitud
                    </button>
                  )}
                  {operation.status === "completed" && !operation.rated && (
                    <button
                      className="button button-primary"
                      onClick={() => onRate(operation)}
                    >
                      Calificar
                    </button>
                  )}
                  {operation.status === "completed" &&
                    operation.type === "rental" &&
                    owner &&
                    operation.listingStatus === "rented" && (
                      <button
                        className="button button-secondary"
                        onClick={() => onReturn(operation)}
                      >
                        Registrar devolución
                      </button>
                    )}
                  {operation.rated && (
                    <span className="form-intro">Calificación registrada</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
