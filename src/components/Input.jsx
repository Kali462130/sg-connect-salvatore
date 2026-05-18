export default function Input({
  label,
  error,
  helpText,
  icon: Icon,
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input className="input" {...props} />
        {Icon && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
}
