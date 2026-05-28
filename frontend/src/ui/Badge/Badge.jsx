import "./Badge.css";

function Badge({ children, variant = "primary", className = "" }) {
  return (
    <span className={`ew-badge ew-badge--${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}

export default Badge;
