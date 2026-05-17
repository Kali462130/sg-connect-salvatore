import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/dashboard';

export default function DashboardPage({ token, onLogout, onNavigate }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const distributionGradient = dashboard
    ? dashboard.distribution.categories
        .reduce(
          (state, category, index, array) => {
            const value = Number(category.percentage.replace('%', ''));
            const start = state.total;
            const end = start + value;
            state.total = end;
            state.segments.push(`${category.color} ${start}% ${end}%`);
            return state;
          },
          { total: 0, segments: [] }
        )
        .segments.join(', ')
    : '';

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.message || 'Impossible de charger le tableau de bord.');
          return;
        }

        setDashboard(data.dashboard);
      } catch (err) {
        setError('Impossible de joindre le serveur.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <p className="loading-text">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell">
        <p className="message message-error">{error}</p>
        <button className="submit-button" onClick={handleLogout}>
          Retourner à la connexion
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="topbar">
        <div className="topbar-left">
          <div className="sg-logo-mini">
            <div className="sg-block sg-block-black" />
            <div className="sg-block sg-block-red" />
          </div>
          <span>Bonjour</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <section className="balance-card red-card">
        <div className="balance-header">
          <span>Solde disponible</span>
          <div className="wallet-icon">💼</div>
        </div>
        <div className="balance-amount">{dashboard.balance.available}</div>
        <div className="balance-footnote">{dashboard.balance.performance}</div>
      </section>

      <section className="blocked-card clickable-card" onClick={() => onNavigate('account')}>
        <div>
          <span className="blocked-title">{dashboard.blockedAccount.title}</span>
          <p className="blocked-subtitle">{dashboard.blockedAccount.subtitle}</p>
        </div>
        <div className="blocked-amount">{dashboard.blockedAccount.amount}</div>
      </section>

      <section className="savings-card">
        <div className="section-title">Épargne</div>
        {dashboard.savings.map((item) => (
          <div key={item.label} className="savings-item">
            <div className="savings-row">
              <span>{item.label}</span>
              <span>{item.ratio}</span>
            </div>
            <div className="savings-subtitle">
              {item.amount} / {item.target}
            </div>
            <div className="savings-progress-bar">
              <div className="savings-progress" style={{ width: `${item.progress * 100}%` }} />
            </div>
          </div>
        ))}
      </section>

      <section className="transactions-card">
        <div className="transactions-header">
          <div>
            <div className="section-title">Transactions récentes</div>
          </div>
          <button type="button" className="link-button small-link" onClick={() => setShowHistory(true)}>
            Voir tout
          </button>
        </div>
        {dashboard.transactions.slice(0, 3).map((txn) => (
          <div key={txn.id} className="transaction-item">
            <div className="transaction-meta">
              <span className={`transaction-icon ${txn.type === 'credit' ? 'credit' : 'debit'}`}>
                {txn.type === 'credit' ? '⬇️' : '⬆️'}
              </span>
              <div>
                <div className="transaction-title">{txn.merchant}</div>
                <div className="transaction-date">{txn.date}</div>
              </div>
            </div>
            <div className={`transaction-amount ${txn.type === 'credit' ? 'positive' : 'negative'}`}>
              {txn.amount}
            </div>
          </div>
        ))}
      </section>

      <section className="distribution-card">
        <div className="distribution-header">
          <div>
            <div className="section-title">Répartition des dépenses</div>
          </div>
          <span className="distribution-total">{dashboard.distribution.total}</span>
        </div>
        <div className="distribution-body">
          <div className="distribution-chart" style={{ background: `conic-gradient(${distributionGradient})` }}>
            <div className="distribution-center">{dashboard.distribution.total}</div>
          </div>
          <div className="distribution-legend">
            {dashboard.distribution.categories.map((category) => (
              <div key={category.label} className="distribution-item">
                <span className="distribution-info">
                  <span className="distribution-dot" style={{ background: category.color }} />
                  <span>{category.label}</span>
                </span>
                <span>{category.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quick-actions-card">
        <div className="section-title">Actions rapides</div>
        <div className="action-grid">
          {dashboard.quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="action-button"
              onClick={() => {
                if (action.label === 'Sécurité') {
                  onNavigate('security');
                }
                if (action.label === 'Virement') {
                  onNavigate('transfer');
                }
              }}
            >
              <span className="action-icon">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="account-card clickable-card" onClick={() => onNavigate('card')}>
        <div className="card-top">
          <span className="card-brand">{dashboard.card.brand}</span>
          <span className="card-chip">•••</span>
        </div>
        <div className="card-number">{dashboard.card.number}</div>
        <div className="card-owner">{dashboard.card.owner}</div>
      </section>

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Historique des transactions</h2>
                <p>Toutes vos transactions depuis 2019</p>
              </div>
              <button className="close-button" onClick={() => setShowHistory(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {dashboard.transactions.map((txn) => (
                <div key={txn.id} className="transaction-item modal-transaction">
                  <div className="transaction-meta">
                    <span className={`transaction-icon ${txn.type === 'credit' ? 'credit' : 'debit'}`}>
                      {txn.type === 'credit' ? '⬇️' : '⬆️'}
                    </span>
                    <div>
                      <div className="transaction-title">{txn.merchant}</div>
                      <div className="transaction-date">{txn.date}</div>
                    </div>
                  </div>
                  <div className={`transaction-amount ${txn.type === 'credit' ? 'positive' : 'negative'}`}>
                    {txn.amount}
                  </div>
                </div>
              ))}
            </div>
            <button className="submit-button modal-close-button" onClick={() => setShowHistory(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button className="nav-button active">🏠</button>
        <button className="nav-button">🔄</button>
        <button className="nav-button">📄</button>
        <button className="nav-button">⚙️</button>
      </nav>
    </div>
  );
}
