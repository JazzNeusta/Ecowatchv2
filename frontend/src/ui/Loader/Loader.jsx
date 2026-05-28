import "./Loader.css";

function Loader({ label = "Chargement", size = "md" }) {
  return (
    <div className={`ew-loader ew-loader--${size}`} role="status" aria-live="polite">
      <span className="ew-loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
