import { cloneElement, useId, useState } from "react";
import { Modal } from "../components/Modal.jsx";
import {
  api,
  imageUrl,
  modalityLabels,
  conditionLabels,
} from "../services/apiClient.js";

export function Field({ label, error, children }) {
  const id = useId();
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        "aria-label": label,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error && (
        <small className="field-error" id={`${id}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}
const ErrorNotice = ({ error }) =>
  error && (
    <p className="form-error" role="alert">
      {error}
    </p>
  );

export function AuthDialog({
  catalog,
  onLogin,
  onClose,
  initialMode = "login",
}) {
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fields, setFields] = useState({});
  const [email, setEmail] = useState("");
  function change(next) {
    setMode(next);
    setError("");
    setFields({});
    setNotice("");
  }
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    setFields({});
    try {
      if (mode === "login")
        await onLogin(await api.login({ email, password: values.password }));
      else if (mode === "register") {
        if (
          !catalog.emailDomains.includes(
            email.trim().toLowerCase().split("@")[1],
          )
        )
          throw new Error(
            "Usa un correo del dominio institucional autorizado.",
          );
        const result = await api.register({
          ...values,
          email,
          semester: Number(values.semester),
        });
        setMode("login");
        setNotice(
          result.verificationSent
            ? "Cuenta creada. Revisa tu correo para verificarla y luego inicia sesión."
            : "Cuenta creada. El envío de verificación aún no está disponible; podrás iniciar sesión y consultar el catálogo, pero publicar requiere verificar tu correo.",
        );
      } else {
        const result = await api.forgot(email);
        setNotice(result.message);
      }
    } catch (failure) {
      setError(failure.message);
      setFields(failure.fields || {});
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={
        mode === "login"
          ? "Inicia sesión"
          : mode === "register"
            ? "Crea tu cuenta universitaria"
            : "Recupera tu acceso"
      }
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p className="form-intro">
        Dominio autorizado:{" "}
        {catalog.emailDomains.join(", ") || "pendiente de configurar"}.
      </p>
      <form className="remote-form" key={mode} onSubmit={submit}>
        <ErrorNotice error={error} />
        {notice && (
          <p className="success-notice" role="status">
            {notice}
          </p>
        )}
        {mode === "register" && (
          <Field label="Nombre" error={fields.name}>
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
            />
          </Field>
        )}
        <Field label="Correo institucional" error={fields.email}>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            autoComplete="email"
            placeholder={`nombre@${catalog.emailDomains[0] || "universidad"}`}
          />
        </Field>
        {mode !== "forgot" && (
          <Field label="Contraseña" error={fields.password}>
            <input
              name="password"
              type="password"
              required
              minLength={mode === "register" ? 12 : 1}
              maxLength={128}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
            />
          </Field>
        )}
        {mode === "register" && (
          <>
            <Field label="Matrícula" error={fields.studentId}>
              <input
                name="studentId"
                required
                pattern="[A-Za-z0-9-]{4,30}"
                maxLength={30}
                autoComplete="off"
              />
            </Field>
            <Field label="Carrera" error={fields.career}>
              <select name="career" required>
                {catalog.careers.map((career) => (
                  <option key={career}>{career}</option>
                ))}
              </select>
            </Field>
            <Field label="Semestre" error={fields.semester}>
              <input
                name="semester"
                type="number"
                required
                min={1}
                max={16}
                defaultValue={1}
              />
            </Field>
          </>
        )}
        <button className="button button-primary" disabled={busy}>
          {busy
            ? "Procesando…"
            : mode === "login"
              ? "Entrar"
              : mode === "register"
                ? "Crear cuenta"
                : "Enviar enlace"}
        </button>
        <div className="auth-links">
          {mode !== "login" && (
            <button
              type="button"
              className="text-link"
              disabled={busy}
              onClick={() => change("login")}
            >
              Ya tengo cuenta
            </button>
          )}
          {mode !== "register" && (
            <button
              type="button"
              className="text-link"
              disabled={busy}
              onClick={() => change("register")}
            >
              Crear cuenta
            </button>
          )}
          {mode === "login" && (
            <button
              type="button"
              className="text-link"
              disabled={busy}
              onClick={() => change("forgot")}
            >
              Olvidé mi contraseña
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export function TokenDialog({ action, token, onClose, onComplete }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (action === "reset" && values.password !== values.confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result =
        action === "verify"
          ? await api.verify(token)
          : await api.reset({ token, password: values.password });
      await onComplete(result.message);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={
        action === "verify"
          ? "Verifica tu correo institucional"
          : "Elige una nueva contraseña"
      }
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form className="remote-form" onSubmit={submit}>
        <ErrorNotice error={error} />
        {action === "reset" ? (
          <>
            <Field label="Nueva contraseña">
              <input
                name="password"
                type="password"
                minLength={12}
                maxLength={128}
                required
                autoComplete="new-password"
              />
            </Field>
            <Field label="Repite la contraseña">
              <input
                name="confirmation"
                type="password"
                minLength={12}
                maxLength={128}
                required
                autoComplete="new-password"
              />
            </Field>
          </>
        ) : (
          <p>
            Confirma que abriste el enlace enviado a tu correo. El enlace se
            puede usar una sola vez.
          </p>
        )}
        <button className="button button-primary" disabled={busy}>
          {busy
            ? "Procesando…"
            : action === "verify"
              ? "Verificar mi correo"
              : "Guardar contraseña"}
        </button>
      </form>
    </Modal>
  );
}

export function ListingDialog({ item, catalog, onSave, onClose }) {
  const raw = item?.raw || item;
  const [modality, setModality] = useState(raw?.modality || "sale");
  const [images, setImages] = useState(raw?.images || []);
  const [pending, setPending] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState({});
  async function close() {
    if (busy) return;
    setBusy(true);
    try {
      await Promise.all(
        pending.map((id) => api.removeUpload(id).catch(() => null)),
      );
      onClose();
    } finally {
      setBusy(false);
    }
  }
  async function upload(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (
      file.size > 5 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setError("Usa JPG, PNG o WebP de hasta 5 MB.");
      input.value = "";
      return;
    }
    if (images.length >= 4) {
      setError("Puedes adjuntar hasta cuatro imágenes.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const uploaded = await api.upload(file);
      setImages((current) => [...current, uploaded]);
      setPending((current) => [...current, uploaded.id]);
    } catch (failure) {
      setError(failure.message);
    } finally {
      input.value = "";
      setBusy(false);
    }
  }
  async function remove(image) {
    if (busy) return;
    setBusy(true);
    try {
      if (pending.includes(image.id)) {
        await api.removeUpload(image.id);
        setPending((current) => current.filter((id) => id !== image.id));
      }
      setImages((current) => current.filter((entry) => entry.id !== image.id));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...values,
      price: ["sale", "rental"].includes(modality) ? Number(values.price) : 0,
      imageIds: images.map((image) => image.id),
    };
    delete body.image;
    setBusy(true);
    setError("");
    setFields({});
    try {
      await onSave(raw?.id, body);
    } catch (failure) {
      setError(failure.message);
      setFields(failure.fields || {});
    } finally {
      setBusy(false);
    }
  }
  const priced = ["sale", "rental"].includes(modality);
  return (
    <Modal
      title={raw?.id ? "Editar publicación" : "Publica para tu comunidad"}
      onClose={close}
    >
      <form className="remote-form" onSubmit={submit}>
        <ErrorNotice error={error} />
        <Field label="Título" error={fields.title}>
          <input
            name="title"
            defaultValue={raw?.title || ""}
            minLength={8}
            maxLength={100}
            required
          />
        </Field>
        <div className="form-row">
          <Field label="Modalidad" error={fields.modality}>
            <select
              name="modality"
              value={modality}
              onChange={(event) => setModality(event.target.value)}
            >
              {Object.entries(modalityLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          {priced && (
            <Field
              label={
                modality === "rental" ? "Precio por día (MXN)" : "Precio (MXN)"
              }
              error={fields.price}
            >
              <input
                name="price"
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                required
                defaultValue={raw?.price || ""}
              />
            </Field>
          )}
        </div>
        <div className="form-row">
          <Field label="Categoría" error={fields.categoryId}>
            <select
              name="categoryId"
              defaultValue={raw?.categoryId || catalog.categories[0]?.id}
              required
            >
              {catalog.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Carrera" error={fields.career}>
            <select
              name="career"
              defaultValue={raw?.career || catalog.careers[0]}
              required
            >
              {catalog.careers.map((career) => (
                <option key={career}>{career}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Condición" error={fields.condition}>
          <select name="condition" defaultValue={raw?.condition || "good"}>
            {Object.entries(conditionLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Punto de entrega" error={fields.location}>
          <input
            name="location"
            required
            minLength={3}
            maxLength={120}
            defaultValue={raw?.location || ""}
            placeholder="Ej. Biblioteca del campus"
          />
        </Field>
        <Field label="Descripción" error={fields.description}>
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={1500}
            rows={4}
            defaultValue={raw?.description || ""}
          />
        </Field>
        <Field label="Imágenes (hasta 4)" error={fields.imageIds}>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy || images.length >= 4}
            onChange={upload}
          />
        </Field>
        <p className="form-intro">JPG, PNG o WebP. Hasta 5 MB por imagen.</p>
        <div className="uploaded-images">
          {images.map((image, index) => (
            <div className="image-preview" key={image.id}>
              <img
                src={imageUrl(image.url)}
                alt={`Imagen ${index + 1} del artículo`}
              />
              <button
                className="text-link"
                type="button"
                disabled={busy}
                onClick={() => remove(image)}
              >
                Quitar imagen {index + 1}
              </button>
            </div>
          ))}
        </div>
        <button
          className="button button-primary"
          disabled={busy || catalog.categories.length === 0}
        >
          {busy
            ? "Guardando…"
            : raw?.id
              ? "Guardar cambios"
              : "Publicar artículo"}
        </button>
      </form>
    </Modal>
  );
}

export function ProfileDialog({ user, catalog, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try {
      await onSave({ ...values, semester: Number(values.semester) });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Editar perfil"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form className="remote-form" onSubmit={submit}>
        <ErrorNotice error={error} />
        <Field label="Nombre">
          <input
            name="name"
            defaultValue={user.name}
            required
            minLength={2}
            maxLength={80}
          />
        </Field>
        <Field label="Carrera">
          <select name="career" defaultValue={user.career}>
            {catalog.careers.map((career) => (
              <option key={career}>{career}</option>
            ))}
          </select>
        </Field>
        <Field label="Semestre">
          <input
            name="semester"
            type="number"
            min={1}
            max={16}
            required
            defaultValue={user.semester}
          />
        </Field>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar perfil"}
        </button>
      </form>
    </Modal>
  );
}

export function ReportDialog({ item, onSave, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    try {
      await onSave({ listingId: item.id, ...values });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title="Reportar publicación"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p>{item.title}</p>
      <form className="remote-form" onSubmit={submit}>
        <ErrorNotice error={error} />
        <Field label="Motivo">
          <select name="reason">
            <option value="spam">Spam</option>
            <option value="inappropriate">Contenido inapropiado</option>
            <option value="fraud">Posible fraude</option>
            <option value="prohibited">Artículo prohibido</option>
          </select>
        </Field>
        <Field label="Describe el problema">
          <textarea
            name="detail"
            minLength={10}
            maxLength={1000}
            required
            rows={4}
          />
        </Field>
        <button className="button button-primary" disabled={busy}>
          {busy ? "Enviando…" : "Enviar reporte"}
        </button>
      </form>
    </Modal>
  );
}

export function ConfirmDialog({ title, text, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Modal
      title={title}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p>{text}</p>
      <ErrorNotice error={error} />
      <div className="dialog-actions">
        <button
          className="button button-secondary"
          disabled={busy}
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className="button button-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm();
            } catch (failure) {
              setError(failure.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Procesando…" : "Confirmar"}
        </button>
      </div>
    </Modal>
  );
}
