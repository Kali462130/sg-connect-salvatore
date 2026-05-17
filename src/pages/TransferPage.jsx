import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/client/transfer';

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
          headers: {
            Authorization: `Bearer ${token}`
          }
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ beneficiaryId, amount, note })
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.message || 'Erreur lors de l’envoi du virement.');
      } else {
        setStatus(data.transfer.message);
        setAmount('');
        setNote('');
      }
    } catch (err) {
      setStatus('Impossible de joindre le serveur.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <button type="button" className="back-button" onClick={onBack}>
          ← Retour
        </button>
      </div>

      {loading && <p className="loading-text">Chargement du virement...</p>}
      {status && <p className="message message-success">{status}</p>}
      {!loading && transfer && (
        <div className="modal-card transfer-card">
          <div className="transfer-balance">
            <span>Solde disponible</span>
            <strong>{transfer.balance}</strong>
          </div>

          <form onSubmit={handleSubmit} className="transfer-form">
            <label>
              Bénéficiaire
              <select value={beneficiaryId} onChange={(e) => setBeneficiaryId(e.target.value)} required>
                {transfer.beneficiaries.map((beneficiary) => (
                  <option key={beneficiary.id} value={beneficiary.id}>
                    {beneficiary.name} • {beneficiary.account}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Montant
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00 €"
                required
              />
            </label>

            <label>
              Motif
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex : Facture EDF"
              />
            </label>

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Envoi en cours...' : 'Envoyer le virement'}
            </button>
          </form>

          <div className="recent-transfers">
            <div className="section-title">Derniers virements</div>
            {transfer.recentTransfers.map((item) => (
              <div key={item.id} className="transaction-item">
                <div>
                  <div className="transaction-title">{item.label}</div>
                  <div className="transaction-date">{item.date}</div>
                </div>
                <div className="transaction-amount negative">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
