import { useState } from 'react';
import LiveMetrics from './components/LiveMetrics.jsx';
import OrderFlowReport from './components/OrderFlowReport.jsx';
import PredictiveInsights from './components/PredictiveInsights.jsx';
import KitchenDisplay from './components/KitchenDisplay.jsx';
import PaymentPanel from './components/PaymentPanel.jsx';
import LoginPage from './components/LoginPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import './App.css';

const ALL_TABS = [
  { id: 'analytics', label: 'Phân tích', roles: ['MANAGER'] },
  { id: 'kds', label: 'Nhà bếp (KDS)', roles: ['MANAGER', 'CHEF', 'WAITER'] },
  { id: 'payment', label: 'Thanh toán', roles: ['MANAGER', 'CASHIER'] },
];

const ROLE_LABELS = {
  MANAGER: 'Quản lý',
  CHEF: 'Đầu bếp',
  WAITER: 'Phục vụ',
  CASHIER: 'Thu ngân',
};

function Dashboard() {
  const { user, logout } = useAuth();
  const visibleTabs = ALL_TABS.filter((t) => t.roles.includes(user.role));
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id || '');

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-logo">IRMS</div>
        <div className="dash-title">Manager Dashboard</div>
        <nav className="dash-nav">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="dash-user">
          <span className="dash-username">{user.username}</span>
          <span className="dash-role-badge">{ROLE_LABELS[user.role] || user.role}</span>
          <button className="btn-logout" onClick={logout}>Đăng xuất</button>
        </div>
      </header>

      <main className="dash-main">
        {activeTab === 'analytics' && (
          <>
            <LiveMetrics />
            <OrderFlowReport />
            <PredictiveInsights />
          </>
        )}
        {activeTab === 'kds' && <KitchenDisplay canUpdate={['MANAGER', 'CHEF'].includes(user.role)} />}
        {activeTab === 'payment' && <PaymentPanel />}
      </main>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
