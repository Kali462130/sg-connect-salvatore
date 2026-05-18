import { Wifi } from 'lucide-react';

export default function VisaCard({ card, reveal = false, compact = false, onClick }) {
  const number = reveal ? card.number : card.maskedNumber || card.number;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`visa-card w-full text-left ${onClick ? 'cursor-pointer' : 'cursor-default'} ${compact ? 'p-5' : ''}`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="visa-chip" aria-hidden="true" />
            <Wifi size={20} className="rotate-90 text-white/80" />
          </div>
          <span className="text-right text-sm font-bold tracking-[0.18em] text-white/90">
            {card.brand || 'VISA'}
          </span>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-white/55">
            Numéro de carte
          </p>
          <p className={`${compact ? 'text-lg' : 'text-xl'} font-mono tracking-[0.16em] text-white`}>
            {number}
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] items-end gap-5">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-white/55">Titulaire</p>
            <p className="truncate text-sm font-semibold tracking-wide">{card.owner}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-white/55">Expire</p>
            <p className="text-sm font-semibold">{card.expiry}</p>
          </div>
          {reveal && (
            <div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-white/55">CVV</p>
              <p className="text-sm font-semibold">{card.cvv}</p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
