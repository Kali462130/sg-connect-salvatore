import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/client/security';

export default function SecurityPage({ token, onBack }) {
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSecurity = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  return (
    <div className="page-shell">
      <div className="page-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Retour
        </button>
      </div>

      {loading && <p className="loading-text">Chargement des paramètres...</p>}
      {error && <p className="message message-error">{error}</p>}

      {security && (
        <div className="security-page-shell">
          <h2>{security.title}</h2>
          <p className="security-subtitle">{security.subtitle}</p>

          <div className="security-status-card">
            <span>{security.level}</span>
          </div>

          <div className="security-options">
            {security.options.map((option) => (
              <div key={option.id} className="security-option-row">
                <div>
                  <div className="security-option-title">{option.title}</div>
                  <div className="security-option-description">{option.description}</div>
                </div>
                <span className={`toggle-pill ${option.enabled ? 'enabled' : ''}`}>
                  {option.enabled ? 'ON' : 'OFF'}
                </span>
              </div>
            ))}
          </div>

          <div className="security-controls">
            {security.controls.map((control) => (
              <button key={control.id} type="button" className="control-button">
                <div>
                  <p>{control.title}</p>
                  <small>{control.description}</small>
                </div>
                <span>›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
