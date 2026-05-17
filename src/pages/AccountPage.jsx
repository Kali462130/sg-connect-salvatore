import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/client/account';

export default function AccountPage({ token, onBack }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  return (
    <div className="page-shell">
      <div className="page-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Retour
        </button>
      </div>

      {loading && <p className="loading-text">Chargement des informations...</p>}
      {error && <p className="message message-error">{error}</p>}

      {account && (
        <div className="modal-card account-modal">
          <div className="alert-box">
            <span className="alert-icon">⚠️</span>
            <div>
              <h2>{account.title}</h2>
              <p>{account.description}</p>
            </div>
          </div>

          <div className="account-details">
            <div className="detail-row">
              <span>Frais de déblocage</span>
              <strong>{account.fees}</strong>
            </div>
            <div className="detail-row">
              <span>Titulaire du compte</span>
              <strong>{account.owner}</strong>
            </div>
            <div className="detail-row">
              <span>Solde bloqué</span>
              <strong>{account.blockedBalance}</strong>
            </div>
            <div className="detail-row">
              <span>Conseiller gestionnaire</span>
              <strong>{account.manager}</strong>
            </div>
            <div className="detail-row">
              <span>Fonction</span>
              <strong>{account.managerTitle}</strong>
            </div>
          </div>

          <button type="button" className="submit-button" onClick={onBack}>
            {account.actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
