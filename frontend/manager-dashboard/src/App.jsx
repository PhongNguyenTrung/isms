import LiveMetrics from './components/LiveMetrics.jsx';
import OrderFlowReport from './components/OrderFlowReport.jsx';
import PredictiveInsights from './components/PredictiveInsights.jsx';
import './App.css';

export default function App() {
  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-logo">IRMS</div>
        <div className="dash-title">Manager Dashboard</div>
        <div className="dash-time">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </header>

      <main className="dash-main">
        <LiveMetrics />
        <OrderFlowReport />
        <PredictiveInsights />
      </main>
    </div>
  );
}
