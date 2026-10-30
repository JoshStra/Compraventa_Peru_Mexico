import { useState } from "react";
import { careers } from "../domain/catalog.js";
import { Modal } from "./Modal.jsx";
import { EmptyState } from "./Catalog.jsx";

export function Profile({
  data,
  onPublish,
  onEditProfile,
  onEditListing,
  onStatus,
  onExport,
}) {
  const { profile, reports } = data;
  const owned = data.listings.filter((item) => item.seller.id === profile.id);
  return (
    <section className="profile-page">
      <div className="profile-cover" />
      <div className="profile-hero">
        <span className="profile-avatar">{profile.initials}</span>
        <div>
          <p className="eyebrow">Perfil local</p>
          <h1>{profile.name}</h1>
          <p>
            {profile.career} · {profile.semester}.º semestre
          </p>
        </div>
        <button className="button button-secondary" onClick={onPublish}>
          Publicar artículo
        </button>
      </div>
      <div className="profile-grid">
        <section>
          <h2>Tu actividad</h2>
          <div className="stat-row">
            <span>
              <strong>{owned.length}</strong>Publicaciones
            </span>
            <span>
              <strong>
                {owned.filter((item) => item.status === "Finalizado").length}
              </strong>
              Finalizadas
            </span>
            <span>
              <strong>{data.favorites.length}</strong>Favoritos
            </span>
          </div>
          <h2>Tus publicaciones</h2>
          {!owned.length ? (
            <EmptyState
              title="Tu catálogo comienza aquí"
              text="Publica un artículo para editarlo y administrar su disponibilidad."
            />
          ) : (
            <ul className="owned-list">
              {owned.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <p>
                      {item.status} · {item.modality}
                    </p>
                  </div>
                  <div className="listing-actions">
                    <button
                      className="text-link"
                      disabled={item.status === "Finalizado"}
                      onClick={() => onEditListing(item)}
                    >
                      Editar
                    </button>
                    <label>
                      Estado de {item.title}
                      <select
                        aria-label={`Estado de ${item.title}`}
                        value={item.status}
                        disabled={item.status === "Finalizado"}
                        onChange={(event) =>
                          onStatus(item.id, event.target.value)
                        }
                      >
                        <option>Disponible</option>
                        <option>Reservado</option>
                        <option>Finalizado</option>
                      </select>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <h2>Tus reportes locales</h2>
          <p className="form-intro">
            Estos reportes se guardan aquí; aún no existe un servicio de
            moderación.
          </p>
          {reports.length ? (
            <ul className="owned-list">
              {reports.map((report) => (
                <li key={report.id}>
                  <div>
                    <strong>
                      {data.listings.find(
                        (item) => item.id === report.listingId,
                      )?.title || "Publicación"}
                    </strong>
                    <p>
                      {report.reason} · {report.status}
                    </p>
                    <p>{report.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No has registrado reportes.</p>
          )}
        </section>
        <aside className="profile-info">
          <h2>Tu información</h2>
          <p>
            Este perfil no tiene autenticación ni verificación institucional.
          </p>
          <p>Los cambios se conservan solo en este navegador.</p>
          <button className="text-link" onClick={onEditProfile}>
            Editar perfil
          </button>
          <hr />
          <button className="text-link" onClick={onExport}>
            Exportar mis datos
          </button>
        </aside>
      </div>
    </section>
  );
}

export function ProfileForm({ profile, onSave, onClose }) {
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    try {
      onSave(Object.fromEntries(new FormData(event.currentTarget)));
    } catch (failure) {
      setError(failure.message);
    }
  }
  return (
    <Modal title="Editar perfil" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label>
          Nombre
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={profile.name}
          />
        </label>
        <label>
          Carrera
          <select name="career" defaultValue={profile.career}>
            {careers.slice(1).map((career) => (
              <option key={career}>{career}</option>
            ))}
          </select>
        </label>
        <label>
          Semestre
          <input
            name="semester"
            type="number"
            min={1}
            max={16}
            step={1}
            required
            defaultValue={profile.semester}
          />
        </label>
        <button type="submit" className="button button-primary">
          Guardar perfil
        </button>
      </form>
    </Modal>
  );
}

export function ReportForm({ item, onSave, onClose }) {
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    try {
      onSave(item.id, Object.fromEntries(new FormData(event.currentTarget)));
    } catch (failure) {
      setError(failure.message);
    }
  }
  return (
    <Modal title="Reportar publicación" onClose={onClose}>
      <p>{item.title}</p>
      <p className="form-intro">
        El reporte se guardará en tu perfil local. No se enviará a un moderador.
      </p>
      <form onSubmit={submit} noValidate>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label>
          Motivo
          <select name="reason">
            <option>Spam</option>
            <option>Contenido inapropiado</option>
            <option>Posible fraude</option>
            <option>Artículo prohibido</option>
          </select>
        </label>
        <label>
          Describe el problema
          <textarea
            name="detail"
            minLength={10}
            maxLength={1000}
            required
            rows={4}
          />
        </label>
        <button type="submit" className="button button-primary">
          Guardar reporte local
        </button>
      </form>
    </Modal>
  );
}
