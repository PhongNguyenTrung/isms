import { useState } from 'react';
import LiveMetrics from './components/LiveMetrics.jsx';
import OrderFlowReport from './components/OrderFlowReport.jsx';
import PredictiveInsights from './components/PredictiveInsights.jsx';
import KitchenDisplay from './components/KitchenDisplay.jsx';
import PaymentPanel from './components/PaymentPanel.jsx';
import './App.css';

const TABS = [
  { id: 'analytics', label: 'Phân tích' },
  { id: 'kds', label: 'Nhà bếp (KDS)' },
  { id: 'payment', label: '💳 Thanh toán' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-logo">IRMS</div>
        <div className="dash-title">Manager Dashboard</div>
        <nav className="dash-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="dash-time">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </header>

      <main className="dash-main">
        {activeTab === 'analytics' && (
          <>
            <LiveMetrics />
            <OrderFlowReport />
            <PredictiveInsights />
          </>
        )}
        {activeTab === 'kds' && <KitchenDisplay />}
        {activeTab === 'payment' && <PaymentPanel />}
      </main>
    </div>
  );
}
