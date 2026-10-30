import { useId, useState } from "react";
import {
  careers,
  categories,
  conditions,
  modalities,
  validateListing,
} from "../domain/catalog.js";
import { readListingImage } from "../services/listingImage.js";
import { Modal } from "./Modal.jsx";

export function ListingForm({ item, onSave, onClose }) {
  const formId = useId();
  const [modality, setModality] = useState(item?.modality || "Venta");
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || "");
  const [imageBusy, setImageBusy] = useState(false);
  const priced = ["Venta", "Renta"].includes(modality);
  const labels = {
    title: "Título",
    modality: "Modalidad",
    category: "Categoría",
    career: "Carrera",
    condition: "Condición",
    location: "Punto de entrega",
    description: "Descripción",
    imageUrl: "Imagen opcional",
    price: modality === "Renta" ? "Precio por día (MXN)" : "Precio (MXN)",
  };
  const errorProps = (name) => ({
    "aria-label": labels[name],
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${formId}-${name}` : undefined,
  });
  const fieldError = (name) =>
    errors[name] && (
      <small className="field-error" id={`${formId}-${name}`}>
        {errors[name]}
      </small>
    );

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = { ...Object.fromEntries(new FormData(form)), imageUrl };
    try {
      validateListing(values);
      onSave(values);
    } catch (error) {
      const fields = error.fields || { form: error.message };
      setErrors(fields);
      const first = Object.keys(fields)[0];
      form.elements.namedItem(first)?.focus();
    }
  }

  async function chooseImage(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setImageBusy(true);
    try {
      setImageUrl(await readListingImage(file));
      setErrors((current) => ({ ...current, imageUrl: undefined }));
    } catch (error) {
      setErrors((current) => ({ ...current, imageUrl: error.message }));
      input.value = "";
    } finally {
      setImageBusy(false);
    }
  }

  return (
    <Modal
      title={item?.id ? "Editar publicación" : "Publica para tu comunidad"}
      onClose={onClose}
    >
      <p className="form-intro">
        Tu publicación se conservará en este navegador.
      </p>
      <form onSubmit={submit} noValidate>
        {Object.values(errors).some(Boolean) && (
          <div className="form-error" role="alert">
            {errors.form || "Revisa los campos indicados antes de guardar."}
          </div>
        )}
        <label>
          Título
          <input
            name="title"
            required
            minLength={8}
            maxLength={100}
            defaultValue={item?.title || ""}
            placeholder="Ej. Calculadora científica"
            {...errorProps("title")}
          />
          {fieldError("title")}
        </label>
        <div className="form-row">
          <label>
            Modalidad
            <select
              name="modality"
              value={modality}
              onChange={(event) => setModality(event.target.value)}
              {...errorProps("modality")}
            >
              {modalities.slice(1).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            {fieldError("modality")}
          </label>
          {priced ? (
            <label>
              {modality === "Renta" ? "Precio por día (MXN)" : "Precio (MXN)"}
              <input
                name="price"
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                required
                defaultValue={
                  item?.modality === "Renta"
                    ? item.rentalPrice
                    : item?.price || ""
                }
                {...errorProps("price")}
              />
              {fieldError("price")}
            </label>
          ) : (
            <p className="form-intro">
              {modality === "Donación"
                ? "La donación es gratuita."
                : "Acuerda el artículo a intercambiar por mensaje."}
            </p>
          )}
        </div>
        <div className="form-row">
          <label>
            Categoría
            <select
              name="category"
              defaultValue={item?.category || categories[0]}
              {...errorProps("category")}
            >
              {categories.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            {fieldError("category")}
          </label>
          <label>
            Carrera
            <select
              name="career"
              defaultValue={item?.career || careers[1]}
              {...errorProps("career")}
            >
              {careers.slice(1).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            {fieldError("career")}
          </label>
        </div>
        <label>
          Condición
          <select
            name="condition"
            defaultValue={item?.condition || conditions[1]}
            {...errorProps("condition")}
          >
            {conditions.slice(1).map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          {fieldError("condition")}
        </label>
        <label>
          Punto de entrega
          <input
            name="location"
            required
            minLength={3}
            maxLength={120}
            defaultValue={item?.location || ""}
            placeholder="Ej. Biblioteca del campus"
            {...errorProps("location")}
          />
          {fieldError("location")}
        </label>
        <label>
          Descripción
          <textarea
            name="description"
            required
            minLength={20}
            maxLength={1500}
            rows={3}
            defaultValue={item?.description || ""}
            placeholder="Incluye el estado y los detalles del artículo."
            {...errorProps("description")}
          />
          {fieldError("description")}
        </label>
        <label>
          Imagen opcional
          <input
            name="imageUrl"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={chooseImage}
            {...errorProps("imageUrl")}
          />
          {fieldError("imageUrl")}
        </label>
        <p className="form-intro">JPG, PNG o WebP. Máximo 500 KB.</p>
        {imageUrl && (
          <div className="image-preview">
            <img src={imageUrl} alt="Vista previa de la publicación" />
            <button
              type="button"
              className="text-link"
              disabled={imageBusy}
              onClick={() => setImageUrl("")}
            >
              Quitar imagen
            </button>
          </div>
        )}
        <button
          className="button button-primary"
          type="submit"
          disabled={imageBusy}
        >
          {imageBusy
            ? "Leyendo imagen…"
            : item?.id
              ? "Guardar cambios"
              : "Publicar artículo"}
        </button>
      </form>
    </Modal>
  );
}
