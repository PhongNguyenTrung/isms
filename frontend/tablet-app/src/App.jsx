import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoginPage from './components/LoginPage';
import MenuPage from './components/MenuPage';
import OrderSuccess from './components/OrderSuccess';
import './App.css';

function AppContent() {
  const { auth } = useAuth();
  const [page, setPage] = useState('menu'); // 'menu' | 'success'
  const [lastOrder, setLastOrder] = useState(null);
  const [lastTableId, setLastTableId] = useState('');

  if (!auth) {
    return <LoginPage onLogin={() => setPage('menu')} />;
  }

  if (page === 'success' && lastOrder) {
    return (
      <OrderSuccess
        order={lastOrder}
        tableId={lastTableId}
        onNewOrder={() => {
          setLastOrder(null);
          setPage('menu');
        }}
      />
    );
  }

  return (
    <MenuPage
      onOrderSuccess={(order, tableId) => {
        setLastOrder(order);
        setLastTableId(tableId);
        setPage('success');
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
