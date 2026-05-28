import "./Card.css";

function Card({
  title,
  subtitle,
  children,
  footer,
  accent = "primary",
  className = "",
}) {
  return (
    <section className={`ew-card ew-card--${accent} ${className}`.trim()}>
      {(title || subtitle) ? (
        <header className="ew-card__header">
          {title ? <h3>{title}</h3> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </header>
      ) : null}

      <div className="ew-card__content">{children}</div>

      {footer ? <footer className="ew-card__footer">{footer}</footer> : null}
    </section>
  );
}

export default Card;
