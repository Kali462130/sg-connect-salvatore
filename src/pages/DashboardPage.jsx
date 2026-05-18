import { useEffect, useState } from 'react';
import SGLogo from '../components/SGLogo';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import VisaCard from '../components/VisaCard';
import { API_BASE_URL } from '../config/api';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  Coffee,
  CreditCard,
  FileText,
  Home,
  LogOut,
  QrCode,
  Receipt,
  Send,
  Shield,
  ShoppingCart,
  Wallet,
} from 'lucide-react';

const API_URL = `${API_BASE_URL}/api/dashboard`;

const transactionIcons = {
  shopping: ShoppingCart,
  salary: Wallet,
  coffee: Coffee,
  games: CreditCard,
  car: Car,
  transfer: Send,
};

const actionIcons = {
  Virement: Send,
  'QR Code': QrCode,
  Factures: FileText,
  Sécurité: Shield,
};

function TransactionRow({ txn, compact = false }) {
  const Icon = transactionIcons[txn.category] || (txn.type === 'credit' ? ArrowDownLeft : ArrowUpRight);
  const isCredit = txn.type === 'credit';

  return (
    <div className={`flex items-center justify-between gap-3 ${compact ? 'py-2' : 'py-3'}`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className={`grid h-11 w-11 flex-none place-items-center rounded-2xl ${
          isCredit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-primary-600'
        }`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-950">{txn.merchant}</p>
          <p className="text-xs font-medium text-gray-500">{txn.date}</p>
        </div>
      </div>
      <p className={`flex-none text-sm font-bold ${isCredit ? 'text-green-600' : 'text-gray-950'}`}>
        {txn.amount}
      </p>
    </div>
  );
}

export default function DashboardPage({ token, onLogout, onNavigate }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Impossible de charger le tableau de bord.');
          return;
        }
        setDashboard(data.dashboard);
      } catch (err) {
        setError('Impossible de joindre le serveur.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="app-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-screen flex items-center justify-center p-4">
        <Card elevated className="max-w-md text-center">
          <p className="mb-6 text-red-600">{error}</p>
          <Button onClick={onLogout} fullWidth>Retourner à la connexion</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-frame">
      <div className="top-safe" />
      <header className="app-header">
        <SGLogo width={36} height={36} />
        <button
          onClick={onLogout}
          className="grid h-10 w-10 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100"
          aria-label="Déconnexion"
        >
          <LogOut size={19} />
        </button>
      </header>

      <main className="page-content space-y-5">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="bg-primary-500 p-6 text-white">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-medium text-white/75">Solde disponible</p>
                <p className="amount-tight text-4xl font-extrabold">{dashboard.balance.available}</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                <Wallet size={25} />
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold">
              <ArrowUpRight size={14} />
              {dashboard.balance.performance}
              <span className="font-medium text-white/70">{dashboard.balance.since}</span>
            </div>
          </div>

          <div className="h-6 bg-white" />

          <button
            type="button"
            onClick={() => onNavigate('account')}
            className="flex w-full items-center justify-between gap-4 bg-black p-5 text-left text-white"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-500">
                <Shield size={20} />
              </span>
              <div>
                <p className="font-bold">{dashboard.blockedAccount.title}</p>
                <p className="text-xs text-white/55">{dashboard.blockedAccount.subtitle}</p>
              </div>
            </div>
            <p className="text-right text-lg font-extrabold text-primary-500">{dashboard.blockedAccount.amount}</p>
          </button>
        </section>

        <Card>
          <h2 className="mb-5 text-xl font-extrabold text-gray-950">Épargne</h2>
          <div className="space-y-5">
            {dashboard.savings.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-950">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.amount} / {item.target}</p>
                  </div>
                  <p className="text-sm font-extrabold text-green-600">{item.ratio}</p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-red-100">
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${item.progress * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-950">Transactions récentes</h2>
            <button
              onClick={() => setShowHistory(true)}
              className="text-sm font-bold text-primary-600"
            >
              Voir tout
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {dashboard.transactions.slice(0, 5).map((txn) => (
              <TransactionRow key={txn.id} txn={txn} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-extrabold text-gray-950">Répartition des dépenses</h2>
          <div className="flex flex-col items-center">
            <div className="donut relative mb-4">
              <p className="relative z-10 text-2xl font-extrabold text-gray-950">{dashboard.distribution.total}</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {dashboard.distribution.categories.map((category) => (
                <div key={category.label} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-gray-600">
                    <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: category.color }} />
                    <span className="truncate">{category.label}</span>
                  </span>
                  <strong>{category.percentage}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-extrabold text-gray-950">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            {dashboard.quickActions.map((action) => {
              const Icon = actionIcons[action.label] || Receipt;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.target)}
                  className="rounded-2xl bg-gray-50 p-5 text-center transition hover:bg-gray-100"
                >
                  <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-primary-600">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm font-bold text-gray-950">{action.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <VisaCard card={dashboard.card} compact onClick={() => onNavigate('card')} />
      </main>

      <Modal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="Historique des transactions"
        subtitle="Toutes vos transactions depuis 2022"
        size="md"
        actions={<Button onClick={() => setShowHistory(false)} fullWidth>Fermer</Button>}
      >
        <div className="max-h-[58vh] space-y-1 overflow-y-auto pr-1">
          {dashboard.transactions.map((txn) => (
            <div key={txn.id} className="rounded-2xl bg-gray-50 px-3">
              <TransactionRow txn={txn} compact />
            </div>
          ))}
        </div>
      </Modal>

      <nav className="bottom-nav">
        <button className="nav-icon active" aria-label="Accueil"><Home size={23} /></button>
        <button onClick={() => onNavigate('transfer')} className="nav-icon" aria-label="Virement"><Send size={23} /></button>
        <button onClick={() => onNavigate('card')} className="nav-icon" aria-label="Carte"><CreditCard size={23} /></button>
        <button onClick={() => onNavigate('security')} className="nav-icon" aria-label="Sécurité"><Shield size={23} /></button>
      </nav>
    </div>
  );
}
