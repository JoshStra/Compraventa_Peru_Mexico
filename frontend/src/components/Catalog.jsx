import { Badge, Icon, ListingVisual } from "./Visuals.jsx";
import { listingPrice } from "../domain/catalog.js";
import { Modal } from "./Modal.jsx";

export function priceLabel(item) {
  if (item.modality === "Donación") return "Gratis";
  if (item.modality === "Intercambio") return "Intercambio";
  return `${new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(listingPrice(item))}${item.modality === "Renta" ? " / día" : ""}`;
}

export function ProductCard({ item, isFavorite, onFavorite, onOpen }) {
  return (
    <article className="product-card">
      <div className="card-media">
        <button
          className="media-open"
          onClick={() => onOpen(item.id)}
          aria-label={`Ver imagen de ${item.title}`}
        >
          <ListingVisual
            type={item.image}
            imageUrl={item.imageUrl}
            title={item.title}
          />
          <Badge modality={item.modality} />
        </button>
        <button
          className={`icon-button favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => onFavorite(item.id)}
          aria-label={`${isFavorite ? "Quitar de" : "Agregar a"} favoritos: ${item.title}`}
          aria-pressed={isFavorite}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
      <div className="card-body">
        <p className="eyebrow">{item.career}</p>
        <h3>
          <button className="title-open" onClick={() => onOpen(item.id)}>
            {item.title}
          </button>
        </h3>
        <p className="card-price">{priceLabel(item)}</p>
        <div className="card-meta">
          <span>{item.condition}</span>
          <span>·</span>
          <span>{item.status}</span>
        </div>
        <div className="seller-mini">
          <span className="avatar avatar-small">{item.seller.initials}</span>
          <span>{item.seller.name}</span>
          {item.seller.rating > 0 && (
            <span className="seller-rating">
              <Icon name="star" size={13} />
              {item.seller.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-mark">
        <Icon name="search" size={27} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function ProductDetail({
  item,
  error,
  profileId,
  isFavorite,
  onClose,
  onFavorite,
  onMessage,
  onSeller,
  onReport,
  onManage,
}) {
  const own = item.seller.id === profileId;
  return (
    <Modal
      title={item.title}
      onClose={onClose}
      className="publish-modal product-detail"
    >
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <ListingVisual
        type={item.image}
        imageUrl={item.imageUrl}
        title={item.title}
        large
      />
      <div className="detail-topline">
        <Badge modality={item.modality} />
        <button
          className={`icon-button favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => onFavorite(item.id)}
          aria-label={
            isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
          }
          aria-pressed={isFavorite}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
      <p className="eyebrow">
        {item.career} · {item.category}
      </p>
      <p className="detail-price">{priceLabel(item)}</p>
      <p className="detail-description">{item.description}</p>
      <div className="detail-facts">
        <span>
          <b>Condición</b>
          {item.condition}
        </span>
        <span>
          <b>Entrega</b>
          {item.location}
        </span>
        <span>
          <b>Estado</b>
          {item.status}
        </span>
      </div>
      <div className="seller-detail">
        <span className="avatar">{item.seller.initials}</span>
        <div>
          <strong>{item.seller.name}</strong>
          <small>
            {own ? "Tu perfil local" : "Perfil de demostración"}
            {item.seller.rating > 0
              ? ` · ${item.seller.rating.toFixed(1)} de muestra`
              : " · Sin calificaciones"}
          </small>
        </div>
        <button className="text-link" onClick={() => onSeller(item.seller)}>
          Ver perfil
        </button>
      </div>
      {own ? (
        <button
          className="button button-primary message-cta"
          onClick={onManage}
        >
          Administrar en mi perfil
        </button>
      ) : (
        <button
          className="button button-primary message-cta"
          disabled={item.status !== "Disponible"}
          onClick={() => onMessage(item.id)}
        >
          <Icon name="message" size={18} />
          {item.status === "Disponible"
            ? "Abrir conversación"
            : "Artículo no disponible"}
        </button>
      )}
      {!own && (
        <button
          className="text-link report-link"
          onClick={() => onReport(item)}
        >
          Reportar publicación
        </button>
      )}
    </Modal>
  );
}
