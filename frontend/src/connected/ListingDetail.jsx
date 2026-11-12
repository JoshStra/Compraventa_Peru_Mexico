import { Modal } from "../components/Modal.jsx";
import { Badge, Icon, ListingVisual } from "../components/Visuals.jsx";
import { priceLabel } from "../components/Catalog.jsx";
import {
  decorateListing,
  initials,
  imageUrl,
  modalityLabels,
  conditionLabels,
  statusLabels,
} from "../services/apiClient.js";
import { useState } from "react";

export function Detail({
  demoMail = false,
  item,
  user,
  favorite,
  error,
  onFavorite,
  onClose,
  onSeller,
  onReport,
  onManage,
  onMessage,
  onOperation,
  onExplore,
}) {
  const [selected, setSelected] = useState(0);
  const own = item.seller.id === user?.id;
  const current = item.images[selected];
  return (
    <Modal
      title={item.title}
      titleInContent
      onClose={onClose}
      className="publish-modal product-detail"
    >
      {(titleId) => (
        <>
          <div className="detail-mobile-top">
            <button className="text-link" aria-label="Cerrar" onClick={onClose}>
              ‹ Atrás
            </button>
            <button
              className="text-link"
              aria-pressed={favorite}
              onClick={onFavorite}
            >
              {favorite ? "Guardado" : "Guardar"}
            </button>
          </div>
          <div className="detail-layout">
            <div className="detail-media">
              <button className="detail-breadcrumb" onClick={onExplore}>
                Explorar / {item.category}
              </button>
              <ListingVisual
                imageUrl={current ? imageUrl(current.url) : ""}
                title={item.title}
                large
              />
              {item.images.length > 1 && (
                <div className="detail-images">
                  {item.images.map((image, index) => (
                    <button
                      key={image.id}
                      aria-label={`Ver imagen ${index + 1} de ${item.title}`}
                      aria-pressed={selected === index}
                      onClick={() => setSelected(index)}
                    >
                      <img
                        src={imageUrl(image.url)}
                        alt={`Miniatura ${index + 1}: ${item.title}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="detail-content">
              <Badge modality={modalityLabels[item.modality]} />
              <h2 id={titleId}>{item.title}</h2>
              <p className="detail-price">
                {priceLabel(decorateListing(item))}
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <p className="detail-description">{item.description}</p>
              <dl className="detail-facts">
                {[
                  ["Carrera", item.career],
                  ["Condición", conditionLabels[item.condition]],
                  ["Entrega", item.location],
                  ["Estado", statusLabels[item.status]],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="seller-detail">
                <span className="avatar">{initials(item.seller.name)}</span>
                <div>
                  <strong>{item.seller.name}</strong>
                  <small>
                    {item.seller.verified
                      ? demoMail
                        ? "Verificado en demostración local"
                        : "Correo verificado"
                      : "Pendiente de verificación"}
                    {item.seller.ratingCount
                      ? ` · ${item.seller.rating.toFixed(1)} / 5`
                      : " · Sin calificaciones"}
                  </small>
                </div>
                <button className="text-link" onClick={onSeller}>
                  Ver perfil
                </button>
              </div>
              <div className="detail-actions">
                <div className="detail-primary-bar">
                  {own ? (
                    <button
                      className="button button-primary"
                      onClick={onManage}
                    >
                      Administrar en mi perfil
                    </button>
                  ) : (
                    <button
                      className="button button-primary"
                      disabled={item.status !== "available"}
                      onClick={onMessage}
                    >
                      Enviar mensaje
                    </button>
                  )}
                </div>
                <button
                  className="button button-secondary detail-save"
                  aria-pressed={favorite}
                  onClick={onFavorite}
                >
                  <Icon name="heart" />
                  {favorite ? "Guardado" : "Guardar"}
                </button>
              </div>
              {!own && (
                <div className="detail-other-actions">
                  <button
                    className="text-link"
                    disabled={item.status !== "available"}
                    onClick={onOperation}
                  >
                    Solicitar artículo
                  </button>
                  <button className="text-link report-link" onClick={onReport}>
                    Reportar publicación
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
