import "./Input.css";

function Input({
  id,
  label,
  helperText,
  error,
  className = "",
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className={`ew-field ${className}`.trim()}>
      {label ? (
        <label className="ew-field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        className={`ew-input ${error ? "ew-input--error" : ""}`.trim()}
        aria-invalid={Boolean(error)}
        {...props}
      />

      {error ? <span className="ew-field__error">{error}</span> : null}
      {!error && helperText ? <span className="ew-field__helper">{helperText}</span> : null}
    </div>
  );
}

export default Input;
