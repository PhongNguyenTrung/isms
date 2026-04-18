import { useState } from 'react';
import LiveMetrics from './components/LiveMetrics.jsx';
import OrderFlowReport from './components/OrderFlowReport.jsx';
import PredictiveInsights from './components/PredictiveInsights.jsx';
import KitchenDisplay from './components/KitchenDisplay.jsx';
import PaymentPanel from './components/PaymentPanel.jsx';
import TableQRPanel from './components/TableQRPanel.jsx';
import MenuPanel from './components/MenuPanel.jsx';
import OrdersPanel from './components/OrdersPanel.jsx';
import LoginPage from './components/LoginPage.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const PAGE_TITLES = {
  dashboard: 'Tổng quan',
  orders:    'Quản lý đơn hàng',
  kds:       'Màn hình nhà bếp (KDS)',
  payment:   'Thanh toán',
  menu:      'Thực đơn',
  tables:    'Quản lý QR bàn',
  analytics: 'Báo cáo đơn hàng',
  insights:  'Dự báo & Khuyến nghị',
};

function Dashboard() {
  const { user, logout } = useAuth();

  const defaultPage =
    user.role === 'CASHIER' ? 'payment'
      : ['CHEF', 'WAITER'].includes(user.role) ? 'kds'
        : 'dashboard';

  const [activePage, setActivePage] = useState(defaultPage);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={PAGE_TITLES[activePage]} />
        <main className="flex-1 overflow-auto p-6 bg-slate-950">
          {activePage === 'dashboard'  && <LiveMetrics />}
          {activePage === 'orders'     && <OrdersPanel />}
          {activePage === 'kds'        && <KitchenDisplay canUpdate={['MANAGER', 'CHEF'].includes(user.role)} />}
          {activePage === 'payment'    && <PaymentPanel />}
          {activePage === 'menu'       && <MenuPanel />}
          {activePage === 'tables'     && <TableQRPanel />}
          {activePage === 'analytics'  && <OrderFlowReport />}
          {activePage === 'insights'   && <PredictiveInsights />}
        </main>
      </div>
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
      <Toaster />
    </AuthProvider>
  );
}
