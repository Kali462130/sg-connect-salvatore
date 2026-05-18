import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomNav from '../components/BottomNav';
import { ArrowLeft, Bell, ChevronRight, Fingerprint, LockKeyhole, Shield, Smartphone } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/client/security`;

const optionIcons = {
  '2fa': Smartphone,
  biometry: Fingerprint,
  alerts: Bell,
  autoLock: LockKeyhole,
};

export default function SecurityPage({ token, onBack, onNavigate }) {
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSecurity = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Impossible de charger les paramètres de sécurité.');
          return;
        }
        setSecurity(data.security);
      } catch (err) {
        setError('Impossible de joindre le serveur.');
      } finally {
        setLoading(false);
      }
    };
    loadSecurity();
  }, [token]);

  if (loading) {
    return (
      <div className="app-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Chargement...</p>
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
          <h1 className="text-lg font-extrabold text-gray-950">{security.title}</h1>
          <p className="text-sm font-medium text-gray-500">{security.subtitle}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700">
          <Shield size={21} />
        </span>
      </header>

      {security && (
        <main className="page-content space-y-5">
          <Card className="border-green-100 bg-green-50">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-700">
                <Shield size={26} />
              </span>
              <div>
                <p className="text-lg font-extrabold text-gray-950">{security.level}</p>
                <p className="text-sm font-semibold text-green-700">{security.levelDescription}</p>
              </div>
            </div>
          </Card>

          <section>
            <h2 className="mb-3 px-1 text-xs font-extrabold uppercase tracking-wide text-gray-500">Options de sécurité</h2>
            <Card className="space-y-1">
              {security.options.map((option) => {
                const Icon = optionIcons[option.id] || Shield;
                return (
                  <div key={option.id} className="flex items-center justify-between gap-4 rounded-2xl p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-gray-50 text-gray-500">
                        <Icon size={20} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-gray-950">{option.title}</p>
                        <p className="text-xs font-medium leading-5 text-gray-500">{option.description}</p>
                      </div>
                    </div>
                    <span className={`toggle flex-none ${option.enabled ? 'on' : ''}`} />
                  </div>
                );
              })}
            </Card>
          </section>

          <Card className="space-y-1">
            {security.controls.map((control) => (
              <button
                key={control.id}
                type="button"
                className="flex w-full items-center justify-between gap-4 rounded-2xl p-3 text-left transition hover:bg-gray-50"
              >
                <div>
                  <p className="font-bold text-gray-950">{control.title}</p>
                  <p className="text-xs font-medium text-gray-500">{control.description}</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </button>
            ))}
          </Card>
        </main>
      )}

      <BottomNav activePage="security" onNavigate={onNavigate} />
    </div>
  );
}
