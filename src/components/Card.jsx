export default function Card({
  children,
  elevated = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`${elevated ? 'card-elevated' : 'card'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
