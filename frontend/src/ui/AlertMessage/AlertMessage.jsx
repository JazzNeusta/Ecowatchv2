import "./AlertMessage.css";

function AlertMessage({ title, children, variant = "info", className = "" }) {
  return (
    <div className={`ew-alert ew-alert--${variant} ${className}`.trim()} role="alert">
      {title ? <strong>{title}</strong> : null}
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export default AlertMessage;
