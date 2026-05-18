export default function Badge({
  children,
  variant = 'info',
  className = '',
  ...props
}) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
