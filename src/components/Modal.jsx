import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  size = 'md',
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className={`w-full ${sizes[size]} rounded-3xl bg-white p-6 shadow-2xl`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-xl font-bold text-gray-950">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div>{children}</div>

        {actions && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
