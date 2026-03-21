import { useEffect, useState } from 'react';
import { getMenu } from '../api/menu';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import MenuCard from './MenuCard';
import CartDrawer from './CartDrawer';

const CATEGORY_ORDER = ['MAIN_DISH', 'BEVERAGE', 'APPETIZER', 'DESSERT'];
const CATEGORY_LABELS = {
  MAIN_DISH: 'Món chính',
  BEVERAGE: 'Đồ uống',
  APPETIZER: 'Khai vị',
  DESSERT: 'Tráng miệng',
};

export default function MenuPage({ onOrderSuccess }) {
  const { auth, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    getMenu()
      .then(setMenuItems)
      .catch(() => setError('Không thể tải menu. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = menuItems.filter((m) => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  // Catch unknown categories
  const knownCats = new Set(CATEGORY_ORDER);
  menuItems.forEach((m) => {
    if (!knownCats.has(m.category)) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m);
    }
  });

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="header-left">
          <span className="header-logo">🍜 IRMS</span>
        </div>
        <div className="header-right">
          <span className="header-user">Xin chào, {auth?.user?.username}</span>
          <button className="btn-ghost" onClick={logout}>
            Đăng xuất
          </button>
          <button
            className="btn-cart"
            onClick={() => setShowCart(true)}
          >
            🛒
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <main className="menu-main">
        {loading && <div className="loading">Đang tải menu...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="menu-section">
            <h2 className="section-title">
              {CATEGORY_LABELS[cat] || cat}
            </h2>
            <div className="menu-grid">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {showCart && (
        <CartDrawer
          onClose={() => setShowCart(false)}
          onOrderSuccess={(order, tableId) => {
            setShowCart(false);
            onOrderSuccess(order, tableId);
          }}
        />
      )}
    </div>
  );
}
