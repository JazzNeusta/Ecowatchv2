import "./Modal.css";
import Button from "../Button/Button";

function Modal({
  isOpen,
  title,
  children,
  onClose,
  actions,
  size = "md",
  closeLabel = "Fermer",
}) {
  if (!isOpen) return null;

  return (
    <div className="ew-modal" role="presentation">
      <div className="ew-modal__overlay" onClick={onClose} />
      <section
        className={`ew-modal__dialog ew-modal__dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "ew-modal-title" : undefined}
      >
        <header className="ew-modal__header">
          {title ? <h2 id="ew-modal-title">{title}</h2> : null}
          <button className="ew-modal__close" type="button" onClick={onClose} aria-label={closeLabel}>
            ×
          </button>
        </header>

        <div className="ew-modal__content">{children}</div>

        {actions ? <footer className="ew-modal__actions">{actions}</footer> : (
          <footer className="ew-modal__actions">
            <Button variant="secondary" onClick={onClose}>{closeLabel}</Button>
          </footer>
        )}
      </section>
    </div>
  );
}

export default Modal;
