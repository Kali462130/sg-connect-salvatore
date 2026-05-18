import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import VisaCard from '../components/VisaCard';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, CreditCard, Settings, Wifi, Lock } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/client/card`;

export default function CardPage({ token, onBack, onNavigate }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reveal, setReveal] = useState(true);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Impossible de charger les informations de la carte.');
          return;
        }
        setCard(data.card);
      } catch (err) {
        setError('Impossible de joindre le serveur.');
      } finally {
        setLoading(false);
      }
    };
    loadCard();
  }, [token]);

  if (loading) {
    return (
      <div className="app-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-screen flex items-center justify-center p-4">
        <Card elevated className="max-w-md text-center">
          <p className="mb-6 text-red-600">{error}</p>
          <Button onClick={onBack} fullWidth>Retour</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-frame">
      <div className="top-safe" />
      <header className="app-header">
        <button onClick={onBack} className="grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-gray-100" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-extrabold text-gray-950">Ma Carte</h1>
          <p className="text-sm font-medium text-gray-500">Gérez votre carte bancaire</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-primary-600">
          <CreditCard size={21} />
        </span>
      </header>

      {card && (
        <main className="page-content space-y-5">
          <VisaCard card={card} reveal={reveal} />

          <Card>
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="font-bold text-gray-700">Plafond mensuel</p>
              <p className="font-extrabold text-gray-950">{card.monthlyLimit} / {card.monthlyLimitMax}</p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-red-100">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${card.utilizationValue * 100}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Renouvellement le {card.renewalDate}</span>
              <span className="text-primary-600">{card.utilization} utilisé</span>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReveal((value) => !value)}
              className="rounded-2xl bg-red-50 p-5 text-left text-primary-700"
            >
              <Lock className="mb-5" size={22} />
              <p className="font-bold">{reveal ? 'Masquer' : 'Afficher'}</p>
              <p className="text-xs font-medium text-primary-700/70">les numéros</p>
            </button>
            <button type="button" className="rounded-2xl bg-gray-50 p-5 text-left text-gray-800">
              <Settings className="mb-5" size={22} />
              <p className="font-bold">Paramètres</p>
              <p className="text-xs font-medium text-gray-500">carte bancaire</p>
            </button>
          </div>

          <Card>
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-gray-400" size={21} />
                  <span className="font-bold text-gray-900">Paiements en ligne</span>
                </div>
                <span className={`toggle ${card.onlinePayments ? 'on' : ''}`} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Wifi className="text-gray-400" size={21} />
                  <span className="font-bold text-gray-900">Sans contact</span>
                </div>
                <span className={`toggle ${card.contactless ? 'on' : ''}`} />
              </div>
            </div>
          </Card>

          <Button variant="secondary" fullWidth onClick={onBack}>Fermer</Button>
        </main>
      )}

      <BottomNav activePage="card" onNavigate={onNavigate} />
    </div>
  );
}
