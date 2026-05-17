import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import CardPage from './pages/CardPage';
import SecurityPage from './pages/SecurityPage';
import TransferPage from './pages/TransferPage';

export default function App() {
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [savedIdentifier] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('identifierClient') || '';
    }
    return '';
  });

  const handleLoginSuccess = (authToken, rememberId, identifierClient) => {
    if (rememberId) {
      localStorage.setItem('identifierClient', identifierClient);
    } else {
      localStorage.removeItem('identifierClient');
    }
    setToken(authToken);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!token) {
    return <LoginPage initialIdentifier={savedIdentifier} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'dashboard') {
    return <DashboardPage token={token} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'account') {
    return <AccountPage token={token} onBack={() => handleNavigate('dashboard')} />;
  }

  if (currentPage === 'card') {
    return <CardPage token={token} onBack={() => handleNavigate('dashboard')} />;
  }

  if (currentPage === 'security') {
    return <SecurityPage token={token} onBack={() => handleNavigate('dashboard')} />;
  }

  if (currentPage === 'transfer') {
    return <TransferPage token={token} onBack={() => handleNavigate('dashboard')} />;
  }

  return null;
}
