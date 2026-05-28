import "./Select.css";

function Select({
  id,
  label,
  options = [],
  placeholder = "Sélectionner une option",
  helperText,
  error,
  className = "",
  ...props
}) {
  const selectId = id || props.name;

  return (
    <div className={`ew-field ${className}`.trim()}>
      {label ? (
        <label className="ew-field__label" htmlFor={selectId}>
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        className={`ew-select ${error ? "ew-select--error" : ""}`.trim()}
        aria-invalid={Boolean(error)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <span className="ew-field__error">{error}</span> : null}
      {!error && helperText ? <span className="ew-field__helper">{helperText}</span> : null}
    </div>
  );
}

export default Select;
