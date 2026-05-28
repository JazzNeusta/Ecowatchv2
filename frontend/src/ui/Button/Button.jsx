import "./Button.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const classes = [
    "ew-button",
    `ew-button--${variant}`,
    `ew-button--${size}`,
    fullWidth ? "ew-button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <span className="ew-button__loader" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
