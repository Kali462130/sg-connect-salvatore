import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/client/card';

export default function CardPage({ token, onBack }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCard = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  return (
    <div className="page-shell">
      <div className="page-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Retour
        </button>
      </div>

      {loading && <p className="loading-text">Chargement de la carte...</p>}
      {error && <p className="message message-error">{error}</p>}

      {card && (
        <div className="card-page-shell">
          <div className="card-preview">
            <div className="card-brand">{card.brand}</div>
            <div className="card-number">{card.number}</div>
            <div className="card-info-row">
              <span>{card.owner}</span>
              <span>{card.expiry}</span>
              <span>CVV {card.cvv}</span>
            </div>
          </div>

          <div className="detail-row">
            <span>Plafond mensuel</span>
            <strong>{card.monthlyLimit} / {card.monthlyLimitMax}</strong>
          </div>
          <div className="detail-row">
            <span>Renouvellement le</span>
            <strong>{card.renewalDate}</strong>
          </div>
          <div className="detail-row">
            <span>Utilisation</span>
            <strong>{card.utilization}</strong>
          </div>

          <div className="toggle-row">
            <span>Paiements en ligne</span>
            <span className={`toggle-pill ${card.onlinePayments ? 'enabled' : ''}`}>{card.onlinePayments ? 'ON' : 'OFF'}</span>
          </div>
          <div className="toggle-row">
            <span>Sans contact</span>
            <span className={`toggle-pill ${card.contactless ? 'enabled' : ''}`}>{card.contactless ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
