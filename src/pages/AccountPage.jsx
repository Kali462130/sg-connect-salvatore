import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomNav from '../components/BottomNav';
import { AlertTriangle, ArrowLeft, Shield, User } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/client/account`;

export default function AccountPage({ token, onBack, onNavigate }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Impossible de charger les informations du compte.');
          return;
        }
        setAccount(data.account);
      } catch (err) {
        setError('Impossible de joindre le serveur.');
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
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
          <h1 className="text-lg font-extrabold text-gray-950">Compte bloqué</h1>
          <p className="text-sm font-medium text-gray-500">Opération impossible</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-primary-600">
          <AlertTriangle size={21} />
        </span>
      </header>

      {account && (
        <main className="page-content space-y-5">
          <Card elevated className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-primary-600">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-950">{account.title}</h2>
            <p className="mt-2 text-sm font-medium text-gray-500">Opération impossible</p>

            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-left">
              <p className="mb-2 font-bold text-gray-950">Votre compte est actuellement bloqué</p>
              <p className="text-sm leading-6 text-gray-700">{account.description}</p>
            </div>

            <div className="mt-5 rounded-2xl bg-gray-950 p-4 text-left text-white">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/55">Frais de déblocage</span>
                <strong className="text-xl text-primary-500">{account.fees}</strong>
              </div>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-white/55">Titulaire du compte</span>
                <strong>{account.owner}</strong>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/55">Solde bloqué</span>
                <strong>{account.blockedBalance}</strong>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 text-left">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-primary-600 shadow-sm">
                <User size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Votre gestionnaire</p>
                <p className="font-extrabold text-gray-950">{account.manager}</p>
                <p className="text-sm text-gray-500">{account.managerTitle}</p>
              </div>
            </div>

            <Button className="mt-6" fullWidth onClick={onBack}>{account.actionLabel}</Button>
          </Card>

          <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
            <Shield size={15} />
            Centre de sécurité Société Générale
          </div>
        </main>
      )}

      <BottomNav activePage="dashboard" onNavigate={onNavigate} />
    </div>
  );
}
