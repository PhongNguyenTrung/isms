import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import MenuPage from './components/MenuPage';
import OrderSuccess from './components/OrderSuccess';
import './App.css';

function getTableIdFromURL() {
  return new URLSearchParams(window.location.search).get('table') || '';
}

function TableSelectScreen({ onConfirm }) {
  const [input, setInput] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) onConfirm(input.trim());
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">🍜</span>
          <h1>IRMS</h1>
          <p>Intelligent Restaurant Management</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="tableInput">Bàn số mấy?</label>
            <input
              id="tableInput"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="VD: T01, T02..."
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={!input.trim()}>
            Xem thực đơn
          </button>
        </form>
      </div>
    </div>
  );
}

function AppContent() {
  const [tableId, setTableId] = useState(getTableIdFromURL);
  const [page, setPage] = useState('menu'); // 'menu' | 'success'
  const [lastOrder, setLastOrder] = useState(null);

  if (!tableId) {
    return <TableSelectScreen onConfirm={setTableId} />;
  }

  if (page === 'success' && lastOrder) {
    return (
      <OrderSuccess
        order={lastOrder}
        tableId={tableId}
        onNewOrder={() => {
          setLastOrder(null);
          setPage('menu');
        }}
      />
    );
  }

  return (
    <MenuPage
      tableId={tableId}
      onOrderSuccess={(order) => {
        setLastOrder(order);
        setPage('success');
      }}
    />
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
