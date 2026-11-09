export function Icon({ name, size = 20, stroke = 1.8 }) {
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.25 4.25" />
      </>
    ),
    heart: (
      <path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    message: (
      <>
        <path d="M20 11.2a7.7 7.7 0 0 1-8 7.3c-1.2 0-2.4-.25-3.4-.75L4 19l1.35-3.65A7.15 7.15 0 0 1 4 11.2 7.7 7.7 0 0 1 12 4a7.7 7.7 0 0 1 8 7.2Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M9.7 21h4.6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    star: (
      <path d="m12 3 2.78 5.63L21 9.54l-4.5 4.38 1.06 6.18L12 17.18 6.44 20.1 7.5 13.92 3 9.54l6.22-.91Z" />
    ),
    check: <path d="m5 12 4.3 4.3L19 6.7" />,
    filter: (
      <>
        <path d="M3 5h18M6 12h12m-9 7h6" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    chip: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 1v3m6-3v3m-6 16v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3" />
      </>
    ),
    flask: (
      <>
        <path d="M9 3h6m-3 0v6l5.5 8.4A2.4 2.4 0 0 1 15.5 21h-7a2.4 2.4 0 0 1-2-3.6L12 9" />
        <path d="M8.3 16h7.4" />
      </>
    ),
    book: (
      <>
        <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12v16H7a2.5 2.5 0 0 0-2.5 2.5z" />
        <path d="M4.5 5.5V21M9 7h6" />
      </>
    ),
    tool: (
      <>
        <path d="m14.7 6.2 3.1-3.1a4.25 4.25 0 0 1-5.6 5.6L5 15.9a2.4 2.4 0 0 0 3.4 3.4l7.2-7.2a4.25 4.25 0 0 1 5.6-5.6l-3.1 3.1" />
      </>
    ),
    send: (
      <>
        <path d="m21 3-8.5 18-2.3-7.2L3 11.5z" />
        <path d="M10.2 13.8 15 9" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m3 17 5-5 4 4 2-2 4 3" />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4m8-4v4M4 10h16" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export function ListingVisual({ large = false, imageUrl, title = "Artículo" }) {
  if (imageUrl)
    return (
      <div className={`listing-visual ${large ? "is-large" : ""}`}>
        <img src={imageUrl} alt={title} />
      </div>
    );
  return (
    <div
      className={`listing-visual is-placeholder ${large ? "is-large" : ""}`}
      role="img"
      aria-label={`Sin fotografía: ${title}`}
    >
      <Icon name="image" size={32} />
      <span>Sin fotografía</span>
    </div>
  );
}

export function Badge({ modality }) {
  return (
    <span
      className={`badge badge-${modality
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}`}
    >
      {modality}
    </span>
  );
}
