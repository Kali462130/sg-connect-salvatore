import { CreditCard, Home, Send, Shield } from 'lucide-react';

const items = [
  { page: 'dashboard', label: 'Accueil', icon: Home },
  { page: 'transfer', label: 'Virement', icon: Send },
  { page: 'card', label: 'Carte', icon: CreditCard },
  { page: 'security', label: 'Sécurité', icon: Shield },
];

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.page}
            type="button"
            onClick={() => onNavigate(item.page)}
            className={`nav-icon ${activePage === item.page ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={23} />
          </button>
        );
      })}
    </nav>
  );
}
