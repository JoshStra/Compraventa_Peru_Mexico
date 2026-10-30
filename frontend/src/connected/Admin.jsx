import { useEffect, useState } from "react";
import { api, statusLabels } from "../services/apiClient.js";
import { Field } from "./Forms.jsx";
import { Modal } from "../components/Modal.jsx";

const reportLabels = {
  open: "Abierto",
  reviewing: "En revisión",
  resolved: "Resuelto",
  dismissed: "Descartado",
};
export function AdminPage({
  revision,
  onRefresh,
  onResolve,
  onSuspend,
  onModerate,
  onCancel,
  onCatalog,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .admin()
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
  }, [revision]);
  return (
    <section className="admin-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Administración</p>
          <h1>Gestión del sistema</h1>
          <p>Revisa reportes y administra el contenido de la comunidad.</p>
        </div>
        <button
          className="button button-secondary refresh-button"
          onClick={onRefresh}
        >
          Actualizar
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!data ? (
        <p role="status">Cargando gestión…</p>
      ) : (
        <>
          <p className="form-intro">
            Los paneles muestran hasta cien registros recientes. Las decisiones
            se registran en la auditoría del servidor.
          </p>
          <section className="admin-section">
            <h2>Reportes de contenido</h2>
            {!data.reports.length ? (
              <p>No hay reportes.</p>
            ) : (
              <ul className="owned-list">
                {data.reports.map((report) => (
                  <li key={report.id}>
                    <div>
                      <strong>{report.title}</strong>
                      <p>
                        {reportLabels[report.status]} · {report.reason} ·
                        Reporta: {report.reporter}
                      </p>
                      <p>{report.detail}</p>
                      {report.resolution && (
                        <p>Resolución: {report.resolution}</p>
                      )}
                    </div>
                    {["open", "reviewing"].includes(report.status) && (
                      <button
                        className="text-link"
                        onClick={() => onResolve(report)}
                      >
                        Revisar reporte
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="admin-section">
            <h2>Reservas activas</h2>
            {!data.operations.length ? (
              <p>No hay reservas activas.</p>
            ) : (
              <ul className="owned-list">
                {data.operations.map((operation) => (
                  <li key={operation.id}>
                    <strong>{operation.title}</strong>
                    <p>{statusLabels[operation.status]}</p>
                    <button
                      className="text-link"
                      onClick={() => onCancel(operation)}
                    >
                      Cancelar reserva por moderación
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="admin-section">
            <h2>Usuarios</h2>
            <ul className="owned-list">
              {data.users.map((user) => (
                <li key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <p>
                      {user.email} · {user.role} ·{" "}
                      {user.verified ? "Verificado" : "Sin verificar"} ·{" "}
                      {user.suspended ? "Suspendido" : "Activo"}
                    </p>
                  </div>
                  {user.role !== "admin" && (
                    <button
                      className="text-link"
                      onClick={() => onSuspend(user)}
                    >
                      {user.suspended ? "Reactivar cuenta" : "Suspender cuenta"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className="admin-section">
            <h2>Publicaciones</h2>
            <ul className="owned-list">
              {data.listings.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {item.seller} · {statusLabels[item.status]}
                      {item.deletedAt ? " · Retirada" : ""}
                    </p>
                  </div>
                  {!item.deletedAt && (
                    <button
                      className="text-link"
                      onClick={() => onModerate(item)}
                    >
                      Retirar por moderación
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <div className="admin-catalogs">
            <section className="admin-section">
              <h2>Categorías</h2>
              <button
                className="text-link"
                onClick={() => onCatalog({ kind: "category" })}
              >
                Agregar categoría
              </button>
              <ul className="owned-list">
                {data.categories.map((category) => (
                  <li key={category.id}>
                    <strong>{category.name}</strong>
                    <button
                      className="text-link"
                      onClick={() =>
                        onCatalog({ kind: "category", item: category })
                      }
                    >
                      {category.active ? "Desactivar" : "Activar"}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <section className="admin-section">
              <h2>Carreras</h2>
              <button
                className="text-link"
                onClick={() => onCatalog({ kind: "career" })}
              >
                Agregar carrera
              </button>
              <ul className="owned-list">
                {data.careers.map((career) => (
                  <li key={career.name}>
                    <strong>{career.name}</strong>
                    <button
                      className="text-link"
                      onClick={() =>
                        onCatalog({ kind: "career", item: career })
                      }
                    >
                      {career.active ? "Desactivar" : "Activar"}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export function ResolutionDialog({ report, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try {
      await onSave(values);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Revisar reporte"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p>
        <strong>{report.title}</strong>
      </p>
      <p>{report.detail}</p>
      <form className="remote-form" onSubmit={submit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Field label="Estado del reporte">
          <select name="status" defaultValue="reviewing">
            <option value="reviewing">En revisión</option>
            <option value="resolved">Resuelto</option>
            <option value="dismissed">Descartado</option>
          </select>
        </Field>
        <Field label="Resolución">
          <textarea
            name="resolution"
            required
            minLength={10}
            maxLength={1500}
            rows={4}
            defaultValue={report.resolution || ""}
          />
        </Field>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar resolución"}
        </button>
      </form>
    </Modal>
  );
}

export function CatalogDialog({ kind, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    setBusy(true);
    try {
      await onSave(name);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={kind === "category" ? "Agregar categoría" : "Agregar carrera"}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form className="remote-form" onSubmit={submit}>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Field label="Nombre">
          <input name="name" minLength={2} maxLength={80} required />
        </Field>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar catálogo"}
        </button>
      </form>
    </Modal>
  );
}
