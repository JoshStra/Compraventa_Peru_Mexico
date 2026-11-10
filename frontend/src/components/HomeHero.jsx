import { Badge, Icon } from "./Visuals.jsx";
import essentials from "../assets/campus-essentials.webp";

export function HomeHero({ onBrowse, onPublish }) {
  return (
    <>
      <p className="community-band">
        Comercio entre estudiantes. Entrega en el campus.
      </p>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Lo que ya no usas.
            <br />
            Alguien lo necesita.
          </h1>
          <p>
            Compra, renta, intercambia o dona materiales académicos con
            estudiantes de tu comunidad.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={onBrowse}>
              Explorar artículos <Icon name="arrow" size={18} />
            </button>
            <button className="button button-secondary" onClick={onPublish}>
              Publicar artículo
            </button>
          </div>
          <ul className="modality-list" aria-label="Formas de reutilizar">
            {["Venta", "Renta", "Intercambio", "Donación"].map((modality) => (
              <li key={modality}>
                <Badge modality={modality} />
              </li>
            ))}
          </ul>
          <div className="trust-line">
            <span>
              <Icon name="check" size={16} />
              Entre estudiantes
            </span>
            <span>
              <Icon name="pin" size={16} />
              Entrega en el campus
            </span>
          </div>
        </div>
        <figure className="hero-media">
          <img
            src={essentials}
            alt="Libros de texto y una calculadora sobre fondo blanco"
            width="1200"
            height="800"
            fetchpriority="high"
            decoding="async"
          />
          <figcaption>
            Menos cosas guardadas.
            <br />
            Más ideas en movimiento.
          </figcaption>
        </figure>
      </section>
    </>
  );
}
