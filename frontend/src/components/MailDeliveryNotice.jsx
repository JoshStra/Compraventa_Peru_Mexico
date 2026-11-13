export function MailDeliveryNotice({ demoMail, mailboxUrl }) {
  if (!demoMail) return null;
  return (
    <aside className="mail-demo-notice" aria-label="Correo de demostración">
      <strong>Demostración local</strong>
      <span>
        Los enlaces se reciben en el buzón de pruebas. No llegan al correo real
        de ITESA ni acreditan su titularidad.
      </span>
      {mailboxUrl && (
        <a
          className="text-link"
          href={mailboxUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir buzón de pruebas
        </a>
      )}
    </aside>
  );
}
