export function HomeHero({ onBrowse, onPublish, actions = true }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>
          Lo que ya no usas,
          <br />
          otro lo necesita.
        </h1>
        <p>
          Compra, renta, intercambia o dona materiales con estudiantes de tu
          campus.
        </p>
        <p className="delivery-note">Entrega en el campus.</p>
        {actions && (
          <div className="hero-actions">
            <button className="button button-secondary" onClick={onBrowse}>
              Explorar artículos
            </button>
            <button className="text-link" onClick={onPublish}>
              Publicar artículo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
