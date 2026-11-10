import { Icon } from "./Visuals.jsx";
import essentials from "../assets/campus-essentials.webp";

export function HomeHero({ onBrowse, onPublish }) {
  return (
    <>
      <p className="community-band">
        Comercio entre estudiantes. Entrega en el campus.
      </p>
      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">Una comunidad. Más posibilidades.</p>
          <h1>
            Lo que ya no usas.
            <br />
            Alguien lo <em>necesita.</em>
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
          <div className="trust-line">
            <span>
              <Icon name="check" size={16} />
              Cuatro formas de reutilizar
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
