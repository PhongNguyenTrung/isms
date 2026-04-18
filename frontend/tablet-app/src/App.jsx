import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import MenuPage from './components/MenuPage';
import OrderSuccess from './components/OrderSuccess';
import './App.css';

const STORAGE_KEY = 'irms_kiosk_table';

// QR mode: resolve session token từ URL
async function resolveQRSession(token) {
  const res = await fetch(`/api/table/resolve?t=${encodeURIComponent(token)}`);
  if (!res.ok) return null;
  return res.json(); // { tableId, sessionToken }
}

// Kiosk setup screen — staff nhập tableId một lần
function KioskSetup({ onSave }) {
  const [input, setInput] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    const tableId = input.trim().toUpperCase();
    if (!tableId) return;
    localStorage.setItem(STORAGE_KEY, tableId);
    onSave(tableId);
  }
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">🍜</span>
          <h1>IRMS</h1>
          <p>Thiết lập bàn</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Số bàn</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="VD: T01, T02, VIP01..."
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={!input.trim()}>
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}

function InvalidToken() {
  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div className="login-logo">
          <span className="logo-icon">🍜</span>
          <h1>IRMS</h1>
        </div>
        <p style={{ color: '#ef4444', marginBottom: 8 }}>QR code đã hết hạn.</p>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Vui lòng nhờ nhân viên tạo QR mới cho bàn.</p>
      </div>
    </div>
  );
}

function AppContent() {
  const qrToken = new URLSearchParams(window.location.search).get('t');
  const isQRMode = Boolean(qrToken);

  // QR mode state
  const [qrSession, setQrSession] = useState(null);   // { tableId, sessionToken }
  const [qrInvalid, setQrInvalid] = useState(false);
  const [qrLoading, setQrLoading] = useState(isQRMode);

  // Kiosk mode state
  const [kioskTableId, setKioskTableId] = useState(() => localStorage.getItem(STORAGE_KEY) || '');

  const [page, setPage] = useState('menu');
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    if (!isQRMode) return;
    resolveQRSession(qrToken)
      .then((s) => s?.tableId ? setQrSession(s) : setQrInvalid(true))
      .catch(() => setQrInvalid(true))
      .finally(() => setQrLoading(false));
  }, []);

  // --- QR mode render ---
  if (isQRMode) {
    if (qrLoading) return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8' }}>Đang xác thực...</p>
        </div>
      </div>
    );
    if (qrInvalid || !qrSession) return <InvalidToken />;

    const tableId = qrSession.tableId;
    if (page === 'success' && lastOrder) return (
      <OrderSuccess order={lastOrder} tableId={tableId}
        onNewOrder={() => { setLastOrder(null); setPage('menu'); }} />
    );
    return (
      <MenuPage tableId={tableId}
        onOrderSuccess={(o) => { setLastOrder(o); setPage('success'); }} />
    );
  }

  // --- Kiosk mode render ---
  if (!kioskTableId) return <KioskSetup onSave={setKioskTableId} />;

  if (page === 'success' && lastOrder) return (
    <OrderSuccess order={lastOrder} tableId={kioskTableId}
      onNewOrder={() => { setLastOrder(null); setPage('menu'); }} />
  );
  return (
    <MenuPage tableId={kioskTableId}
      onOrderSuccess={(o) => { setLastOrder(o); setPage('success'); }} />
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
