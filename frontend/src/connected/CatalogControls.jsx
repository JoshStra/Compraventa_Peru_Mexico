import { Icon } from "../components/Visuals.jsx";
import { Modal } from "../components/Modal.jsx";
import { emptyFilters } from "../domain/catalogNavigation.js";
import {
  modalityLabels,
  conditionLabels,
  statusLabels,
} from "../services/apiClient.js";

export function CategoryTabs({ categories, value, onChange }) {
  return (
    <nav className="category-tabs" aria-label="Categorías">
      {[
        ["", "Todo"],
        ...categories.map((category) => [category.id, category.name]),
      ].map(([id, name]) => (
        <button
          key={id}
          className={value === id ? "active" : ""}
          aria-pressed={value === id}
          onClick={() => onChange(id)}
        >
          {name}
        </button>
      ))}
    </nav>
  );
}

export function FilterChips({ filters, catalog, onRemove }) {
  const names = {
    career: "Carrera",
    categoryId: "Categoría",
    modality: "Modalidad",
    condition: "Condición",
    status: "Disponibilidad",
    minPrice: "Precio mínimo",
    maxPrice: "Precio máximo",
  };
  const values = {
    categoryId: catalog.categories.find(
      (item) => item.id === filters.categoryId,
    )?.name,
    modality: modalityLabels[filters.modality],
    condition: conditionLabels[filters.condition],
    status: filters.status === "all" ? "Todas" : statusLabels[filters.status],
  };
  return (
    <div className="filter-chips" aria-label="Filtros aplicados">
      {Object.entries(names)
        .filter(([key]) => filters[key] !== emptyFilters[key])
        .map(([key, label]) => (
          <button
            className="filter-chip"
            key={key}
            aria-label={`Quitar filtro: ${label}`}
            onClick={() => onRemove(key)}
          >
            {label}: {values[key] || filters[key]}
            <Icon name="close" size={14} />
          </button>
        ))}
    </div>
  );
}

export function CatalogFilters({
  catalog,
  filters,
  priceError,
  onChange,
  onReset,
  onClose,
}) {
  const options = [
    ["career", "Carrera", catalog.careers.map((name) => [name, name])],
    [
      "categoryId",
      "Categoría",
      catalog.categories.map((item) => [item.id, item.name]),
    ],
    ["modality", "Modalidad", Object.entries(modalityLabels)],
    ["condition", "Condición", Object.entries(conditionLabels)],
    [
      "status",
      "Disponibilidad",
      Object.entries(statusLabels).filter(([key]) =>
        [
          "available",
          "reserved",
          "sold",
          "rented",
          "exchanged",
          "donated",
        ].includes(key),
      ),
    ],
  ];
  return (
    <div id="filtros">
      <Modal
        title="Filtros"
        onClose={onClose}
        className="publish-modal filter-panel filter-sheet"
      >
        <label className="filter-select">
          Buscar artículos
          <input
            aria-label="Buscar artículos"
            value={filters.q}
            maxLength={100}
            onChange={(event) => onChange("q", event.target.value)}
            placeholder="Refinar búsqueda"
          />
        </label>
        {options.map(([key, label, items]) => (
          <label className="filter-select" key={key}>
            {label}
            <select
              aria-label={label}
              value={filters[key]}
              onChange={(event) => onChange(key, event.target.value)}
            >
              <option value={key === "status" ? "all" : ""}>
                Todas las opciones
              </option>
              {items.map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div className="price-range-fields">
          {[
            ["minPrice", "Precio mínimo"],
            ["maxPrice", "Precio máximo"],
          ].map(([key, label]) => (
            <label className="filter-select" key={key}>
              {label}
              <input
                type="number"
                min={0}
                max={1000000}
                step="0.01"
                value={filters[key]}
                aria-invalid={priceError}
                aria-describedby={priceError ? "error-precio" : undefined}
                onChange={(event) => onChange(key, event.target.value)}
              />
            </label>
          ))}
        </div>
        {priceError && (
          <p
            className="field-error price-range-error"
            id="error-precio"
            role="alert"
          >
            El precio mínimo no puede ser mayor que el máximo.
          </p>
        )}
        <div className="filter-actions">
          <button className="clear-filters" onClick={onReset}>
            Limpiar filtros
          </button>
          <button className="button button-primary" onClick={onClose}>
            Ver resultados
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="catalog-loading" role="status">
      <span className="sr-only">Cargando artículos…</span>
      <div className="product-grid" aria-hidden="true">
        {[1, 2, 3, 4].map((key) => (
          <div className="skeleton-card" key={key}>
            <div />
            <i />
            <i />
          </div>
        ))}
      </div>
    </div>
  );
}
