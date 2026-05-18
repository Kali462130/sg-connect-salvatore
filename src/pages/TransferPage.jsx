import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertTriangle, ArrowLeft, Clock, Send, Wallet } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/client/transfer`;

export default function TransferPage({ token, onBack }) {
  const [transfer, setTransfer] = useState(null);
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTransfer = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await response.json();
        if (!response.ok) {
          setStatus('Impossible de charger les informations de virement.');
          return;
        }
        setTransfer(data.transfer);
        setBeneficiaryId(data.transfer.beneficiaries[0]?.id || '');
      } catch (err) {
        setStatus('Impossible de joindre le serveur.');
      } finally {
        setLoading(false);
      }
    };
    loadTransfer();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ beneficiaryId, amount, note })
      });
      const data = await response.json();
      setStatus(response.ok ? data.transfer.message : data.message || "Erreur lors de l'envoi du virement.");
      if (response.ok) {
        setAmount('');
        setNote('');
      }
    } catch (err) {
      setStatus('Impossible de joindre le serveur.');
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="mobile-frame">
      <div className="top-safe" />
      <header className="app-header">
        <button onClick={onBack} className="grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-gray-100" aria-label="Retour">
          <ArrowLeft size={22} />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-extrabold text-gray-950">Virement</h1>
          <p className="text-sm font-medium text-gray-500">Envoyer de l'argent</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-primary-600">
          <Send size={21} />
        </span>
      </header>

      {transfer && (
        <main className="page-content space-y-5">
          <Card className="border-red-100 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 flex-none text-primary-600" size={22} />
              <div>
                <p className="font-extrabold text-gray-950">Compte actuellement bloqué</p>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Le déblocage du compte reste requis pour une opération de virement.
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex min-h-[180px] flex-col justify-between bg-primary-500 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-base font-bold text-white">Solde disponible</p>
                <p className="amount-tight text-4xl font-extrabold">{transfer.balance}</p>
              </div>
              <span className="grid h-14 w-14 place-items-center bg-white/15">
                <Wallet size={28} />
              </span>
            </div>
            {/* <div className="mt-8 inline-flex w-fit items-center gap-2 bg-white/15 px-4 py-2 text-sm font-bold">
              Disponible pour consultation
            </div> */}
          </Card>

          <Card>
            <h2 className="mb-5 text-xl font-extrabold text-gray-950">Détails du virement</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Bénéficiaire</label>
                <select
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                  required
                  className="input cursor-pointer appearance-none bg-white pr-10"
                >
                  {transfer.beneficiaries.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.id}>
                      {beneficiary.name} • {beneficiary.account}
                    </option>
                  ))}
                </select>
              </div>

              <Input label="Montant" type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00 €" required />
              <Input label="Motif" type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex: Facture EDF" />

              {status && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">{status}</p>
                </div>
              )}

              <Button type="submit" fullWidth variant="primary" size="lg" loading={submitting}>
                <Send size={18} className="mr-2" />
                Envoyer le virement
              </Button>
            </form>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Clock size={20} className="text-gray-600" />
              <h2 className="text-xl font-extrabold text-gray-950">Derniers virements</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {transfer.recentTransfers.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-950">{item.label}</p>
                    <p className="text-xs font-medium text-gray-500">{item.date}</p>
                  </div>
                  <p className={`flex-none text-sm font-extrabold ${item.amount.startsWith('+') ? 'text-green-600' : 'text-gray-950'}`}>
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </main>
      )}
    </div>
  );
}
