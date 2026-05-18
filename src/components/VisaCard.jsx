import { Wifi } from 'lucide-react';

export default function VisaCard({ card, reveal = false, compact = false, onClick }) {
  const number = reveal ? card.number : card.maskedNumber || card.number;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`visa-card w-full text-left ${onClick ? 'cursor-pointer' : 'cursor-default'} ${compact ? 'p-5' : ''}`}
      style={{ WebkitTouchCallout: 'none' }}
    >
      <div className="visa-card-inner">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="visa-chip" aria-hidden="true" />
            <Wifi size={20} className="rotate-90 text-white/80 flex-shrink-0" />
          </div>
          <span className="text-right text-xs sm:text-sm font-bold tracking-[0.18em] text-white/90 flex-shrink-0">
            {card.brand || 'VISA'}
          </span>
        </div>

        <div>
          <p className="mb-1 sm:mb-2 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-white/55">
            Numéro de carte
          </p>
          <p className={`visa-card-number ${compact ? 'compact' : ''}`}>
            {number}
          </p>
        </div>

        <div className="visa-card-details">
          <div className="flex-1 min-w-0">
            <p className="mb-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-white/55">Titulaire</p>
            <p className="truncate text-xs sm:text-sm font-semibold tracking-wide">{card.owner}</p>
          </div>
          <div className="flex-shrink-0">
            <p className="mb-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-white/55">Expire</p>
            <p className="text-xs sm:text-sm font-semibold">{card.expiry}</p>
          </div>
          {reveal && (
            <div className="flex-shrink-0">
              <p className="mb-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide text-white/55">CVV</p>
              <p className="text-xs sm:text-sm font-semibold">{card.cvv}</p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
