import { useEffect, useId, useRef } from "react";
import { Icon } from "./Visuals.jsx";

export function Modal({
  title,
  onClose,
  children,
  className = "publish-modal",
}) {
  const titleId = useId();
  const dialog = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (
      dialog.current.querySelector("input, select, textarea") || dialog.current
    ).focus();
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...dialog.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]',
        ),
      ];
      const first = controls[0];
      const last = controls.at(-1);
      if (!controls.length) {
        event.preventDefault();
        dialog.current.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialog}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <Icon name="close" />
        </button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </section>
    </div>
  );
}
